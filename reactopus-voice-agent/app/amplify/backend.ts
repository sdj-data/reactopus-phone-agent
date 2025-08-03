import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { voiceApi } from './functions/voice-api/resource';

const backend = defineBackend({
  auth,
  data,
  voiceApi,
});

// Add REST API with /voice endpoint
backend.addOutput({
  custom: {
    API: {
      [voiceApi.resourcePath]: {
        endpoint: `https://${backend.data.resources.graphqlApi.apiId}.appsync-api.${backend.data.resources.graphqlApi.env.region}.amazonaws.com`,
        region: backend.data.resources.graphqlApi.env.region,
        authorizationType: "API_KEY",
        apiKey: backend.data.resources.graphqlApi.apiKey
      }
    }
  }
});

// Create REST API Gateway for voice endpoints
backend.createStack("voice-rest-api", (stack) => {
  const { RestApi, LambdaIntegration, Cors } = require('aws-cdk-lib/aws-apigateway');
  const { CfnOutput } = require('aws-cdk-lib');

  const api = new RestApi(stack, "VoiceRestAPI", {
    restApiName: "voiceApi",
    description: "REST API for Reactopus Voice Agent",
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
    },
  });

  // Create /voice resource
  const voiceResource = api.root.addResource("voice");
  
  // Add POST method to /voice with Lambda integration
  voiceResource.addMethod("POST", new LambdaIntegration(backend.voiceApi.resources.lambda), {
    apiKeyRequired: true
  });
  
  // Add OPTIONS method for CORS
  voiceResource.addMethod("OPTIONS");

  // Create API key
  const apiKey = api.addApiKey('VoiceApiKey', {
    apiKeyName: 'voiceApiKey'
  });

  // Create usage plan
  const usagePlan = api.addUsagePlan('VoiceApiUsagePlan', {
    name: 'voiceApiUsagePlan',
    apiStages: [{
      api: api,
      stage: api.deploymentStage
    }]
  });

  usagePlan.addApiKey(apiKey);

  // Output the API endpoint and key
  new CfnOutput(stack, "VoiceAPIEndpoint", {
    value: api.url,
    description: "Voice REST API endpoint URL",
  });

  new CfnOutput(stack, "VoiceAPIKey", {
    value: apiKey.keyId,
    description: "Voice REST API Key ID",
  });
});
