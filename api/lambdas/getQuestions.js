import { getAllQuestions } from '../models/question';


export async function handler() {
  try {
    const questions = await getAllQuestions();
    return {
      statusCode: 200,
      headers: {
        'Cache-control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(questions)
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
