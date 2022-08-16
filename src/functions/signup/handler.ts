import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const AWS = require('aws-sdk')
import schema from './schema';

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const cognito = new AWS.CognitoIdentityServiceProvider()

  const { email, password }=event.body

  const { user_pool_id } = process.env
   
  console.log(user_pool_id);
  
  

  if (!email || !password){
    return formatJSONResponse({
      message: "Email / Password missing"
    });
  }
  
  const params = {
    UserPoolId: user_pool_id,
    Username: email,
    UserAttributes: [{
        Name: 'email',
        Value: email
      },
      {
        Name: 'email_verified',
        Value: 'true'
      }
    ],
    MessageAction: 'SUPPRESS'
  }
  const response = await cognito.adminCreateUser(params).promise();

  console.log("Response: ");

  console.log(response);
  
  if (response.User) {
    const paramsForSetPass = {
      Password: password,
      UserPoolId: user_pool_id,
      Username: email,
      Permanent: true
    };
    await cognito.adminSetUserPassword(paramsForSetPass).promise()
  }

  return formatJSONResponse({
    message: `Successfully logged in as ${email}`
  });
 
};

export const main = middyfy(signup);