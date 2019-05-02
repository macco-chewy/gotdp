import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient();

// define dynamo indexes
const TYPE = 'User';
const INDEX = `${TYPE.toUpperCase()}|v0`;
const INDEX_U = `${TYPE.toUpperCase()}|v`;

const CHAR_POINTS = 5;
const QUES_POINTS = 10;

// Base Character object
export const User = function ({ name = '', bids = {}, questions = {}, score = 0 } = {}) {
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
    ignore: false,
    questions,
    score
  }
};

// formatting / marshalling
const IGNORED_PROPS = ['type'];


export const getAllUsers = async (sortKey = 'name') => {
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
  const users = [];
  items.forEach(item => {
    users.push(convertDynamoItemToUser(item));
  });

  if (sortKey) {
    const compare = function (key, a, b) {
      // look for key in top level props
      let compareA = a[key];
      let compareB = b[key];

      // if not there find it in attributes
      if (!compareA) {
        compareA = a.attributes[key];
        compareB = b.attributes[key];
      }

      if (compareA < compareB) {
        return -1;
      }
      if (compareA > compareB) {
        return 1;
      }
      return 0;
    };
    users.sort(compare.bind(null, sortKey));
  }

  return users;
}


export const getUserById = async (id) => {
  // const params = {
  //   TableName: process.env.GOTDP_DYNAMO_TABLE,
  //   Key: { id, sk: INDEX }
  // };
  // console.log(await documentClient.get(params).promise());
  return;
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
    return;
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


export const refreshUserScore = async (user, characters, questions) => {
  if (!user) {
    throw new Error('user is required');
  }
  if (!(user instanceof User)) {
    throw new Error('user must be of type User');
  }

  // zero out score
  user.attributes.score = 0;

  // loop characters
  characters.forEach(character => {
    const cid = character.id;
    const bid = user.attributes.bids[cid];
    if (bid) {

      // console.log('Bid:', character.attributes.status, bid, (character.attributes.status === bid), (character.attributes.status === bid && character.attributes.status !== '1'));

      // if the character status equals the user bid then the user chose correctly - add a point
      if (character.attributes.status === bid) {
        user.attributes.score += CHAR_POINTS;

        // if the character is also deceased then the user also chose the correct wight status - add a point
        if (character.attributes.status !== '1') {
          user.attributes.score += CHAR_POINTS;
        }
      }
    }
  });

  // loop questions
  questions.forEach(question => {
    // if no correct answer then don't count the point
    if (!question.attributes.correctAnswer) {
      return;
    }

    const qid = question.id;
    const bid = user.attributes.questions[qid];

    // console.log(question.attributes.correctAnswer, bid, (question.attributes.correctAnswer === bid));

    // if the user answered the question correctly - add a point
    if (question.attributes.correctAnswer === bid) {
      user.attributes.score += QUES_POINTS;
    }
  });

  return await saveUser(user);

}




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
