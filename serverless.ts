import login from '@functions/login';
import signup from '@functions/signup';
import type { AWS } from '@serverless/typescript';



const SERVICE_NAME = "todo-list-dharsini";
const DYNAMO_TABLE = `${SERVICE_NAME}-dev`;

const serverlessConfiguration: AWS = {
  service: SERVICE_NAME ,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: 
    [
      {
        Effect:'Allow',
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "cognito-idp:AdminInitiateAuth",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword",
        ],
        // Resource:"arn:aws:dynamodb:us-east-1:877969058937:table/todo_item_dharsini"
        Resource:["arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4","arn:aws:dynamodb:us-east-1:877969058937:table/todo-list-dharsini-dev"]
      }
    ],

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DYNAMO_TABLE,
      user_pool_id: "us-east-1_sDD69kyR4",
      client_id: "7seaetv0ci1u54poue55oe8cpn" 
    },
  },
  // import the function via paths
  functions: { 
    signup,login,
    postTodo: {
      handler: "./src/functions/hello/handler.postTodo",
      events: [
        {
          http: {
            method: "post",
            path: "todoItems",
            authorizer:{
              name: "PrivateAuthorizer-dharsini",
              type: "COGNITO_USER_POOLS",
              arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
            },

          },
        },
      ],
    },
getTodo: {
      handler: "./src/functions/hello/handler.getTodo",
      events: [
        {
          http: {
            method: "get",
            path: "todoItems/{date}",
            authorizer:{
              name: "PrivateAuthorizer-dharsini",
              type: "COGNITO_USER_POOLS",
              arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
            },
          },
        },
      ],
    },
    updateTodo: {
      handler: "./src/functions/hello/handler.updateTodo",
      events: [
        {
          http: {
            method: "put",
            path: "todoItems/{date}",
            authorizer:{
              name: "PrivateAuthorizer-dharsini",
              type: "COGNITO_USER_POOLS",
              arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
            },
          },
        },
      ],
    },
    deleteTodo: {
      handler: "./src/functions/hello/handler.deleteTodo",
      events: [
        {
          http: {
            method: "delete",
            path: "todoItems/{date}",
            authorizer:{
              name: "PrivateAuthorizer-dharsini",
              type: "COGNITO_USER_POOLS",
              arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
            },
          },
        },
      ],
    },
    getAllTodo: {
      handler: "./src/functions/hello/handler.getAllTodo",
      events: [
        {
          http: {
            method: "get",
            path: "todoAllItems",
            authorizer:{
              name: "PrivateAuthorizer-dharsini",
              type: "COGNITO_USER_POOLS",
              arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_sDD69kyR4"
            },
          },
        },
      ],
    },
    // login: {
    //   handler: "./src/functions/login/handler.login",
    //   events:[
    //     {
    //       http: {
    //         method: "post",
    //         path:"login",
    //         cors: true
    //       },
    //     },
    //   ] 
    // },

   
   },
  resources:{
    Resources:{
      ToDoTable:{
        Type:"AWS::DynamoDB::Table",
        Properties:{
          TableName: DYNAMO_TABLE,
          AttributeDefinitions:[
            {AttributeName:'date', AttributeType:'S'}
          ],
          KeySchema:[
            {AttributeName:'date', KeyType:'HASH'}
          ],
          BillingMode:'PAY_PER_REQUEST',
        }
      },

    //   UserPool:{
    //     Type: "AWS::Cognito::UserPool",
    //     Properties:{
    //       UserPoolName: "todo-item-dharsini",
    //       Schema:[
    //         {
    //         Name: "email",
    //         Required: true,
    //         Mutable: true
    //       }
    //     ],
    //       Policies:{
    //         PasswordPolicy:{
    //           MinimumLength: 8,
    //         }
    //       },
    //       AutoVerifiedAttributes: ["email"]
    //     }
    //   },
    //   UserClient:{
    //     Type: "AWS::Cognito::UserPoolClient",
    //     Properties:{
    //       ClientName: "todo-item-dharsini",
    //       GenerateSecret: false,
    //       UserPoolId:  { Ref: "UserPool" },
    //       AccessTokenValidity: 5,
    //       IdTokenValidity: 5,
    //       ExplicitAuthFlows:["ADMIN_NO_SRP_AUTH"]
    //     }
         
    //   }
    },
  
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
