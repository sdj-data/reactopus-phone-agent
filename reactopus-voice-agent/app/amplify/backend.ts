import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { handleIncomingCall } from './functions/handle-incoming-call/resource';
import { voiceApi } from './functions/voice-api/resource';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  handleIncomingCall,
  voiceApi,
});

// Create REST API for voice endpoints
backend.createStack("voice-api-stack", (stack) => {
  const api = new RestApi(stack, "VoiceAPI", {
    restApiName: "ReactopusVoiceAPI",
    description: "REST API for Reactopus Voice Agent",
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: ['Content-Type', 'Authorization'],
    },
  });

  const voiceResource = api.root.addResource("api").addResource("voice");
  const startResource = voiceResource.addResource("start");
  
  startResource.addMethod("POST", new LambdaIntegration(backend.voiceApi.resources.lambda));
  startResource.addMethod("OPTIONS"); // For CORS

  // Output the API endpoint
  new CfnOutput(stack, "VoiceAPIEndpoint", {
    value: api.url,
    description: "Voice API endpoint URL",
  });
});
