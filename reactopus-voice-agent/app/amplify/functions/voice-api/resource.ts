import { defineFunction } from '@aws-amplify/backend';

export const voiceApi = defineFunction({
  name: 'handleIncomingCall',
  entry: './handler.ts',
  environment: {
    CONNECT_INSTANCE_ID: process.env.CONNECT_INSTANCE_ID || '',
  },
  timeoutSeconds: 30,
  runtime: 20,
});