const { createSign } = require('crypto');
const { makeRequest } = require('./https');

const signPayload = ({ privateKey, payload }) => {
  const signer = createSign('SHA256');
  signer.write(payload);
  signer.end();
  return signer.sign(privateKey, 'hex');
};

const payload = {
  userId: 'xxxxxxxxxxxxx', // CNIC of the end user
  endUserIp: 'xxx.xxx.xxx.xxx', // IP of the end user
  visibleData: 'xxx', // a message that will be displayed to the end user when they are verifying the request.
  verificationMethods: {
    bioLivenessRequests: true / false, // if you require bio liveness (defaults to false)
  },
  rpId: 'xxxxx', // your organization number (which is used to uniquely identify your relying party)
  appId: 'xx', // if you have multiple applications you should indicate to which app this request if from, if you don’t have multiple applications set it to ‘1’ which is your default app
};
const signature = signPayload({
  payload: JSON.stringify(payload), // because signer requests string
  privateKey: process.env.PRIVATE_KEY, // fetch it from your environment variable
});

const body = { request: payload, signature };

const response = await makeRequest({
  baseUrl: 'appapi.meraid.pk',
  path: '/rp/v1/auth',
  body: body,
});

console.log(response); // handle response as you will
