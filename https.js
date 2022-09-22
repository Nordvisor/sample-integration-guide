const https = require('https');

const makeRequest = async ({ baseUrl, path, body }) => {
  const options = {
    hostname: baseUrl,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Connection: 'keep-alive',
      Accept: '*/*',
    },
  };

  const result = await createRequest({ options, body });
  return result;
};

const createRequest = ({ options, body }) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let responseBody = '';

      res.on('data', chunk => {
        responseBody += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(responseBody);
        if (response.code === 0) resolve(response);
        else
          reject({
            serviceRejection: true,
            message: response.message,
          });
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.write(JSON.stringify(body));
    req.end();
  });
};

module.exports = { makeRequest };
