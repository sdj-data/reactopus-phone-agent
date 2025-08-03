import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { voiceApi } from './functions/voice-api/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  voiceApi,
});

// Grant the Lambda function permission to read SSM parameters
backend.voiceApi.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ssm:GetParameter', 'ssm:GetParameters'],
    resources: ['arn:aws:ssm:*:*:parameter/reactopus/voice/*'],
  })
);
