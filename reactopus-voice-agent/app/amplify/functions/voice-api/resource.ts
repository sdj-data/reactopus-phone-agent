import { defineFunction } from '@aws-amplify/backend';

export const voiceApi = defineFunction({
  name: 'handleIncomingCall',
  entry: './handler.ts',
  environment: {
    // Environment variables will be set by the backend
    CONNECT_INSTANCE_ID: process.env.CONNECT_INSTANCE_ID || '',
  },
  timeoutSeconds: 30,
});

// This function will have permissions to interact with Amazon Connect