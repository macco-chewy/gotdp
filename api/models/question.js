import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';

import * as common from '../libs/common';

const documentClient = new DynamoDB.DocumentClient();

// define dynamo indexes
const TYPE = 'Question';
const INDEX = `${TYPE.toUpperCase()}|v0`;
const INDEX_U = `${TYPE.toUpperCase()}|v`;


// Base Question object
export const Question = function ({ name = '', type = '', text = '', answers, dependsOn, finalAnswer } = {}) {
  // properties
  this.type = TYPE;
  this.id = uuid();
  this.name = name;
  this.version = 1;
  this.createDt = 0;
  this.updateDt = 0;

  // attributes
  this.attributes = {
    type,
    text,
    answers: (answers) ? JSON.parse(JSON.stringify(answers)) : undefined,
    dependsOn,
    finalAnswer
  }
};

// formatting / marshalling
const IGNORED_PROPS = ['type'];


export const getAllQuestions = async () => {
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
  const questions = {};
  items.forEach(item => {
    questions[item.name] = convertDynamoItemToQuestion(item);
  });

  return Object.sort(questions);
}


export const getQuestionById = async (id) => {
  // const params = {
  //   TableName: process.env.GOTDP_DYNAMO_TABLE,
  //   Key: { id, sk: INDEX }
  // };
  // console.log(await documentClient.get(params).promise());
  return undefined;
};


export const getQuestionByName = async (name) => {
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

  // if more than one question returned
  if (items.length > 1) {
    throw new Error(`Multiple questions returned for name ${name}`);
  }

  return convertDynamoItemToQuestion(items[0]);
};


export const saveQuestion = async (question) => {
  if (!(question instanceof Question)) {
    throw new Error('Cannot save question - not of type Question');
  }

  // check if item already exists
  const existingQuestion = await getQuestionByName(question.name);
  if (existingQuestion) {

    const deepEqual = require('fast-deep-equal');
    if (deepEqual(existingQuestion.attributes, question.attributes)) {
      return existingQuestion;
    }

    // version and archive the existing question
    const item = convertQuestionToDynamoItem(existingQuestion);
    item.sk = `${INDEX_U}${existingQuestion.version}`;
    const params = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Item: item
    };
    await documentClient.put(params).promise();

    // merge existing property values
    // replace the id
    question.id = existingQuestion.id;
    // bump the current version
    question.version = existingQuestion.version + 1;
    // update the updateDt
    question.updateDt = Date.now();
    // update attributes
    question.attributes = Object.assign({}, existingQuestion.attributes, question.attributes);

    // create attribute updates
    const updates = {};
    updates.version = { Action: 'PUT', Value: question.version };
    updates.updateDt = { Action: 'PUT', Value: question.updateDt };
    updates.attributes = { Action: 'PUT', Value: question.attributes };

    // update v0 question
    const updateparams = {
      TableName: process.env.GOTDP_DYNAMO_TABLE,
      Key: {
        id: question.id,
        sk: INDEX,
      },
      AttributeUpdates: updates
    };
    await documentClient.update(updateparams).promise();

    return question;
  }

  // set create and update dates
  question.createDt = question.updateDt = Date.now();
  const item = convertQuestionToDynamoItem(question);
  const params = {
    TableName: process.env.GOTDP_DYNAMO_TABLE,
    Item: item
  };
  await documentClient.put(params).promise();

  return question;
};


export const refreshQuestionByName = async (name, attributes = {}) => {
  if (!name) {
    throw new Error('name is required');
  }

  // get new question object
  attributes.name = name;
  const question = new Question(attributes);

  for (const attribute in question.attributes) {
    if (question.attributes[attribute] === undefined) {
      delete question.attributes[attribute];
    }
  }

  // save the question
  await saveQuestion(question);
};

const convertDynamoItemToQuestion = (item = {}) => {
  const question = new Question();

  for (const prop in question) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      question[prop] = item[prop]
    }
  }

  // return question
  return question;
};


const convertQuestionToDynamoItem = (question = {}) => {
  const item = {};

  for (const prop in question) {
    if (IGNORED_PROPS.indexOf(prop) === -1) {
      item[prop] = question[prop];
    }
  }

  // fix item props
  item.sk = INDEX;

  // return item
  return item;
};
