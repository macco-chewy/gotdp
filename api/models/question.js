import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient();

// define dynamo indexes
const TYPE = 'Question';
const INDEX = `${TYPE.toUpperCase()}|v0`;
const INDEX_U = `${TYPE.toUpperCase()}|v`;


// Base Question object
export const Question = function ({ name = '', type = '', text = '', answers, correctAnswer, dependsOn } = {}) {
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
    correctAnswer,
    dependsOn
  }
};

// formatting / marshalling
const IGNORED_PROPS = ['type'];


export const getAllQuestions = async (sortKey = 'name') => {
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
  const questions = [];
  items.forEach(item => {
    questions.push(convertDynamoItemToQuestion(item));
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
    questions.sort(compare.bind(null, sortKey));
  }

  return questions;
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
    // replace the createDt
    question.createDt = existingQuestion.createDt;
    // bump the current version
    question.version = existingQuestion.version + 1;
    // update the updateDt
    question.updateDt = Date.now();

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

  // delete correctAnswer - this is not the interface for setting that value
  delete question.attributes.correctAnswer;

  for (const attribute in question.attributes) {
    if (question.attributes[attribute] === undefined) {
      delete question.attributes[attribute];
    }
  }

  // save the question
  return await saveQuestion(question);
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
