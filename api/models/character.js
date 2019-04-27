import { v4 as uuid } from 'uuid';
import * as request from 'request-promise';
import { DynamoDB } from 'aws-sdk';
const cheerio = require('cheerio');

import * as common from '../libs/common';

const documentClient = new DynamoDB.DocumentClient();

// define dynamo indexes
const TYPE = 'Character';
const INDEX = `${TYPE.toUpperCase()}|v0`;
const INDEX_U = `${TYPE.toUpperCase()}|v`;

// Character status enumeration
const CHARACTER_STATUS = {
  0: { display: 'Undefined', regex: /^$/ },
  1: { display: 'Alive', regex: /^alive$/i },
  2: { display: 'Deceased', regex: /^deceased$/i },
  3: { display: 'Wight / White Walker', regex: /(?=.*reanimated)^deceased/i }
};

// Base Character object
export const Character = function () {
  // properties
  this.type = TYPE;
  this.id = uuid();
  this.name = '';
  this.version = 1;
  this.createDt = 0;
  this.updateDt = 0;

  // attributes
  this.attributes = {
    age: 0,
    bids: {
      1: [],
      2: []
    },
    displayName: '',
    imageUrl: '',
    sourceUrl: '',
    status: 0
  }
};

// formatting / marshalling
const IGNORED_PROPS = ['type'];

export const getAllCharacters = async () => {
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    IndexName: "GS_Type",
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":sk": INDEX
    }
  };

  //return (await documentClient.query(params).promise()).Items;
  const items = (await documentClient.query(params).promise()).Items;
  const characters = {};
  items.forEach(item => {
    characters[item.name] = convertDynamoItemToCharacter(item);
  });

  return Object.sort(characters);
}


export const getCharacterById = async (id) => {
  // const params = {
  //   TableName: process.env.GOTDP_DYNAMO_TABLE,
  //   Key: { id, sk: INDEX }
  // };
  // console.log(await documentClient.get(params).promise());
  return undefined;
};


export const getCharacterByName = async (name) => {
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    IndexName: "GS_Name",
    KeyConditionExpression: "#name = :name and #sk = :sk",
    ExpressionAttributeNames: {
      "#name": "name",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":sk": INDEX
    }
  };
  const items = (await documentClient.query(params).promise()).Items;

  // if no items
  if (!Array.isArray(items) || items.length === 0) {
    return undefined;
  }

  // if more than one character returned
  if (items.length > 1) {
    throw new Error(`Multiple characters returned for name ${name}`);
  }

  return convertDynamoItemToCharacter(items[0]);
};


export const saveCharacter = async (character) => {
  if (!(character instanceof Character)) {
    throw new Error('Cannot save character - not of type Character');
  }

  // check if item already exists
  const existingCharacter = await getCharacterByName(character.name);
  if (existingCharacter) {

    const deepEqual = require('fast-deep-equal');
    if (deepEqual(existingCharacter.attributes, character.attributes)) {
      return existingCharacter;
    }

    // version and archive the existing character
    const item = convertCharacterToDynamoItem(existingCharacter);
    item.sk = `${INDEX_U}${existingCharacter.version}`;
    const params = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Item: item
    };
    await documentClient.put(params).promise();

    // merge existing property values
    // replace the id
    character.id = existingCharacter.id;
    // replace the createDt
    character.createDt = existingCharacter.createDt;
    // bump the current version
    character.version = existingCharacter.version + 1;
    // update the updateDt
    character.updateDt = Date.now();
    // update attributes
    character.attributes = Object.assign({}, existingCharacter.attributes, character.attributes);

    // create attribute updates
    const updates = {};
    updates.version = { Action: 'PUT', Value: character.version };
    updates.updateDt = { Action: 'PUT', Value: character.updateDt };
    updates.attributes = { Action: 'PUT', Value: character.attributes };

    // update v0 character
    const updateparams = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Key: {
        id: character.id,
        sk: INDEX,
      },
      AttributeUpdates: updates
    };
    await documentClient.update(updateparams).promise();

    return character;
  }

  // set create and update dates
  character.createDt = character.updateDt = Date.now();
  const item = convertCharacterToDynamoItem(character);
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    Item: item
  };
  await documentClient.put(params).promise();

  return character;
};


export const refreshCharacterByName = async (name) => {
  let displayName = name;
  if (typeof name === 'object') {
    displayName = name.displayName;
    name = name.name;
  }

  // fetch current character data from wiki
  const character = await fetchCharacterFromWiki(name);

  // save displayName
  character.attributes.displayName = displayName;

  // prevent overwriting bids by deleting
  delete character.attributes.bids;

  return await saveCharacter(character);
};




const scrubName = function (name) {
  return name.split(' ').join('_');
};


const deriveStatus = function (statusString) {
  for (let statusId in CHARACTER_STATUS) {
    const status = CHARACTER_STATUS[statusId];
    if (status.regex.test(statusString)) {
      return statusId;
    }
  }
  return 0;
}


const fetchCharacterFromWiki = async (name) => {
  const profileSourceUrl = 'https://gameofthrones.fandom.com/wiki';
  const sourceUrl = `${profileSourceUrl}/${scrubName(name)}`;

  let characterHTML;
  try {
    const response = await request.get(sourceUrl);
    characterHTML = cheerio.load(response);
  } catch (e) {
    if (e.statusCode) {
      switch (e.statusCode) {
        case 404:
          throw new Error(`Character "${name}" not found`);
      }
    }
    throw e;
  }

  const character = new Character();
  character.name = characterHTML('h2[data-source=Title]').text();
  character.attributes.age = parseInt(characterHTML('div[data-source=Age] div').text().substr(0, 2), 10) || 0;
  character.attributes.displayName = name;
  character.attributes.imageUrl = characterHTML('figure[data-source=Image] a img').attr('src');
  character.attributes.sourceUrl = sourceUrl;
  character.attributes.status = deriveStatus(characterHTML('div[data-source=Status] div a').text());

  for (const attribute in character.attributes) {
    if (character.attributes[attribute] === undefined) {
      delete character.attributes[attribute];
    }
  }

  return character;
};

const convertDynamoItemToCharacter = (item = {}) => {
  const character = new Character();

  for (const prop in character) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      character[prop] = item[prop]
    }
  }

  // return character
  return character;
};


const convertCharacterToDynamoItem = (character = {}) => {
  const item = {};

  for (const prop in character) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      item[prop] = character[prop];
    }
  }

  // fix item props
  item.sk = INDEX;

  // return item
  return item;
};
