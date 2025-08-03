import { defineFunction } from '@aws-amplify/backend';

export const voiceApi = defineFunction({
  name: 'voiceApi',
  entry: './handler.ts',
  environment: {
    // Environment variables will be set by the backend
  }
});

// This function will have permissions to interact with Amazon Connect