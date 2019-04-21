
export function handler(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Cache-control': 'no-store',
      'Pragma': 'no-cache',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: 'ok'
  });
}
