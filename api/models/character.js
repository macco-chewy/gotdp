import { v4 as uuid } from 'uuid';
import * as request from 'request-promise';
import { DynamoDB } from 'aws-sdk';
const cheerio = require('cheerio');

const documentClient = new DynamoDB.DocumentClient();

// Character status enumeration
const CHARACTER_STATUS = {
  0: { display: 'Undefined', regex: /^$/ },
  1: { display: 'Alive', regex: /^Alive/ },
  2: { display: 'Deceased', regex: /^Deceased/ }
};

// Base Character object
export const Character = function () {
  // properties
  this.type = 'Character';
  this.id = uuid();
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
    imageUrl: '',
    name: '',
    sourceUrl: '',
    status: 0
  }
};


export const getAllCharacters = async () => {
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    IndexName: "GS_Type",
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":sk": 'CHARACTER|v0'
    }
  };

  //return (await documentClient.query(params).promise()).Items;
  const items = (await documentClient.query(params).promise()).Items;
  const characters = [];
  items.forEach(item => {
    characters.push(convertDynamoItemToCharacter(item));
  });

  return characters;
}


export const getCharacterById = async (id) => {
  // const params = {
  //   TableName: process.env.GOTDP_DYNAMO_TABLE,
  //   Key: { id, sk: 'CHARACTER|v0' }
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
      ":sk": 'CHARACTER|v0'
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
  const existingCharacter = await getCharacterByName(character.attributes.name);
  if (existingCharacter) {
    const attributes = [];
    for (let attribute in character.attributes) {
      if (JSON.stringify(character.attributes[attribute]) !== JSON.stringify(existingCharacter.attributes[attribute])) {
        attributes.push(attribute);
      }
    }

    // if no changed attributes return existing character
    if (attributes.length === 0) {
      return existingCharacter;
    }

    // put new character version
    const item = convertCharacterToDynamoItem(existingCharacter);
    item.sk = `CHARACTER|v${existingCharacter.version}`;
    const params = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Item: item
    };
    await documentClient.put(params).promise();

    // bump the current version
    existingCharacter.version++;

    // update the updateDt
    existingCharacter.updateDt = Date.now();

    // create attribute updates
    const attributeUpdates = {};
    attributes.forEach(attribute => {
      attributeUpdates[attribute] = { Action: 'PUT', Value: character.attributes[attribute] }
    });
    attributeUpdates.updateDt = { Action: 'PUT', Value: existingCharacter.updateDt }

    // update v0 character
    const updateparams = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Key: {
        id: existingCharacter.id,
        sk: 'CHARACTER|v0',
      },
      AttributeUpdates: attributeUpdates
    };
    await documentClient.update(updateparams).promise();

    return existingCharacter;
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
  const character = await fetchCharacterFromWiki(name);
  saveCharacter(character);
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
  character.attributes.age = parseInt(characterHTML('div[data-source=Age] div').text().substr(0, 2), 10) || 0;
  character.attributes.imageUrl = characterHTML('figure[data-source=Image] a img').attr('src');
  character.attributes.name = characterHTML('h2[data-source=Title]').text();
  character.attributes.sourceUrl = sourceUrl;
  character.attributes.status = deriveStatus(characterHTML('div[data-source=Status] div a').text());
  return character;
};


const convertDynamoItemToCharacter = (item = {}) => {
  const character = new Character();
  // populate properties
  [
    'id',
    'createDt',
    'updateDt',
    'version'
  ].forEach(prop => {
    character[prop] = item[prop];
  });

  // populate attributes
  [
    'age',
    'bids',
    'imageUrl',
    'name',
    'sourceUrl',
    'status'
  ].forEach(prop => {
    character.attributes[prop] = item[prop];
  });

  // return character
  return character;
};


const convertCharacterToDynamoItem = (character = {}) => {
  const item = {};

  //populate properties
  [
    'id',
    'createDt',
    'updateDt',
    'version'
  ].forEach(prop => {
    item[prop] = character[prop];
  });

  // populate attributes
  [
    'age',
    'bids',
    'imageUrl',
    'name',
    'sourceUrl',
    'status',
  ].forEach(prop => {
    item[prop] = character.attributes[prop];
  });

  // fix item props
  item.sk = 'CHARACTER|v0';

  // return item
  return item;
};
