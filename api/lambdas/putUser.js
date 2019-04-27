import { User, saveUser } from '../models/user';


export async function handler(event) {
  try {

    const data = JSON.parse(event.body);
    const { name, bids, questions } = data;
    const user = await saveUser(new User({ name, bids, questions }));

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
