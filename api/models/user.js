import { v4 as uuid } from 'uuid';
import * as request from 'request-promise';
import { DynamoDB } from 'aws-sdk';

import * as common from '../libs/common';

const documentClient = new DynamoDB.DocumentClient();

// define dynamo indexes
const TYPE = 'User';
const INDEX = `${TYPE.toUpperCase()}|v0`;
const INDEX_U = `${TYPE.toUpperCase()}|v`;

// Base Character object
export const User = function ({ name = '', bids = {}, questions = {} } = {}) {
  // properties
  this.type = TYPE;
  this.id = uuid();
  this.name = name;
  this.version = 1;
  this.createDt = 0;
  this.updateDt = 0;

  // attributes
  this.attributes = {
    bids,
    questions
  }
};

// formatting / marshalling
const IGNORED_PROPS = ['type'];


export const getAllUsers = async () => {
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

  const items = (await documentClient.query(params).promise()).Items;
  const users = {};
  items.forEach(item => {
    users[item.name] = convertDynamoItemToUser(item);
  });

  return Object.sort(users);
}


export const getUserById = async (id) => {
  // const params = {
  //   TableName: process.env.GOTDP_DYNAMO_TABLE,
  //   Key: { id, sk: INDEX }
  // };
  // console.log(await documentClient.get(params).promise());
  return undefined;
};


export const getUserByName = async (name) => {
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
    throw new Error(`Multiple users returned for name ${name}`);
  }

  return convertDynamoItemToUser(items[0]);
};


export const saveUser = async (user) => {
  if (!(user instanceof User)) {
    throw new Error('Cannot save user - not of type User');
  }

  // check if item already exists
  const existingUser = await getUserByName(user.name);
  if (existingUser) {
    const deepEqual = require('fast-deep-equal');
    if (deepEqual(existingUser.attributes, user.attributes)) {
      return existingUser;
    }

    // version and archive the existing character
    const item = convertUserToDynamoItem(existingUser);
    item.sk = `${INDEX_U}${existingUser.version}`;
    const params = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Item: item
    };
    await documentClient.put(params).promise();

    // merge existing property values
    // replace the id
    user.id = existingUser.id;
    // replace the createDt
    user.createDt = existingUser.createDt;
    // bump the current version
    user.version = existingUser.version + 1;
    // update the updateDt
    user.updateDt = Date.now();
    // update attributes
    user.attributes = Object.assign({}, existingUser.attributes, user.attributes);

    // create attribute updates
    const updates = {};
    updates.version = { Action: 'PUT', Value: user.version };
    updates.updateDt = { Action: 'PUT', Value: user.updateDt };
    updates.attributes = { Action: 'PUT', Value: user.attributes };

    // update v0 character
    const updateparams = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Key: {
        id: user.id,
        sk: INDEX,
      },
      AttributeUpdates: updates
    };
    await documentClient.update(updateparams).promise();

    return user;
  }

  // set create and update dates
  user.createDt = user.updateDt = Date.now();
  const item = convertUserToDynamoItem(user);
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    Item: item
  };
  await documentClient.put(params).promise();

  return user;
};




const convertDynamoItemToUser = (item = {}) => {
  const user = new User();

  for (const prop in user) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      user[prop] = item[prop]
    }
  }

  // return character
  return user;
};


const convertUserToDynamoItem = (user = {}) => {
  const item = {};

  for (const prop in user) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      item[prop] = user[prop];
    }
  }

  // fix item props
  item.sk = INDEX;

  // return item
  return item;
};
