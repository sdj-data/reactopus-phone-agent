import { defineFunction } from '@aws-amplify/backend';

export const voiceApi = defineFunction({
  name: 'handleIncomingCall',
  entry: './handler.ts',
  environment: {
    CONNECT_INSTANCE_ID: process.env.CONNECT_INSTANCE_ID || '',
    GEMINI_API_KEY_PARAM: '/reactopus/voice/GEMINI_API_KEY',
  },
  timeoutSeconds: 30,
  runtime: 20,
});

// Grant the function permission to read the SSM parameter
voiceApi.addEnvironment('GEMINI_API_KEY_PARAM', '/reactopus/voice/GEMINI_API_KEY');