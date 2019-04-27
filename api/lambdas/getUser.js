import { getUserByName } from '../models/user';


export async function handler(event) {
  try {

    const name = event.pathParameters.name;
    const user = await getUserByName(name);

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Cache-control': 'no-store',
          'Pragma': 'no-cache',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Cache-control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(user)
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
