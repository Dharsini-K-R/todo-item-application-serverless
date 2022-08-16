import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const AWS = require('aws-sdk')
import schema from './schema';

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const cognito = new AWS.CognitoIdentityServiceProvider()

  const {
    email,
    password
  } = event.body
  const {
    user_pool_id,
    client_id
  } = process.env
   
  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: user_pool_id,
    ClientId: client_id,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  }
  const response = await cognito.adminInitiateAuth(params).promise();
  

  return formatJSONResponse({
      message: 'Success',
      token: response.AuthenticationResult.IdToken
    });
 
};

export const main = middyfy(login);