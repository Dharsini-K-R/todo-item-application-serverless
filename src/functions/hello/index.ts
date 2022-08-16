import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        authorizer:{
          name: "PrivateAuthorizer-dharsini",
          type: "COGNITO_USER_POOLS",
          arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
        },
      },
    },
  ],
};
