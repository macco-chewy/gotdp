import { v4 as uuid } from 'uuid';
import { get } from 'request-promise';
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
  this.age = '';
  this.bids = {
    1: [],
    2: []
  };
  this.createDt = 0;
  this.id = uuid();
  this.imageUrl = '';
  this.name = '';
  this.sourceUrl = '';
  this.status = 0;
  this.updateDt = 0;
  this.version = 1;
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
  return (await documentClient.query(params).promise()).Items;
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
  const existingCharacter = await getCharacterByName(character.name);
  if (existingCharacter) {
    const props = [];
    for (let prop in character) {
      const ignoredProps = ['id', 'createDt', 'updateDt'];
      if (ignoredProps.indexOf(prop) === -1 && JSON.stringify(character[prop]) !== JSON.stringify(existingCharacter[prop])) {
        props.push(prop);
      }
    }

    // if no changed props return existing character
    if (props.length === 0) {
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
    props.push('updateDt');
    existingCharacter.updateDt = Date.now();

    // create attribute updates
    const attributeUpdates = {};
    props.forEach(prop => {
      attributeUpdates[prop] = { Action: 'PUT', Value: character[prop] }
    });

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
  try {
    await documentClient.put(params).promise();
  } catch (e) {
    console.log('failed on this item', item);
  }

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
    const response = await get(sourceUrl);
    characterHTML = cheerio.load(response);
  } catch (e) {
    switch (e.statusCode) {
      case 404:
        throw new Error(`Character "${name}" not found`);
      default:
        throw e;
    }
  }

  const character = new Character();
  character.age = characterHTML('div[data-source=Age] div').text().substr(0, 2);
  character.imageUrl = characterHTML('figure[data-source=Image] a img').attr('src');
  character.name = characterHTML('h2[data-source=Title]').text();
  character.sourceUrl = sourceUrl;
  character.status = deriveStatus(characterHTML('div[data-source=Status] div a').text());

  return character;
};


const convertDynamoItemToCharacter = (item = {}) => {
  const character = new Character();
  character.age = item.age;
  character.bids = item.bids;
  character.createDt = item.createDt;
  character.id = item.id;
  character.imageUrl = item.imageUrl;
  character.name = item.name;
  character.sourceUrl = item.sourceUrl;
  character.status = item.status;
  character.updateDt = item.updateDt;
  character.version = item.version;
  return character;
};


const convertCharacterToDynamoItem = (character = {}) => {
  return {
    age: character.age || 'Unknown',
    bids: character.bids,
    createDt: character.createDt,
    id: character.id,
    imageUrl: character.imageUrl,
    name: character.name,
    sk: 'CHARACTER|v0',
    sourceUrl: character.sourceUrl,
    status: character.status,
    updateDt: character.updateDt,
    version: character.version
  };
};
