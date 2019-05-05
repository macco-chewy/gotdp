import { getQuestionByName, saveQuestion } from '../models/question';


export async function handler(event) {
  try {

    const data = JSON.parse(event.body);
    const { name, attributes: { correctAnswer } } = data;
    if (!name || !correctAnswer) {
      return {
        statusCode: 400,
        headers: {
          'Cache-control': 'no-store',
          'Pragma': 'no-cache',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Invalid request' })
      };
    }

    let question = await getQuestionByName(name);
    if (!question) {
      return {
        statusCode: 404,
        headers: {
          'Cache-control': 'no-store',
          'Pragma': 'no-cache',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Object not found' })
      };
    }

    // set the answer
    question.attributes.correctAnswer = correctAnswer;

    // save le question
    question = await saveQuestion(question);

    return {
      statusCode: 200,
      headers: {
        'Cache-control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(question)
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: {
        'Cache-control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: e.message })
    }
  }
}
