import { getAllCharacters } from '../models/character';


export async function handler() {
  try {
    const characters = await getAllCharacters();
    return {
      statusCode: 200,
      headers: {
        'Cache-control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(characters)
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
