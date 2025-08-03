import { defineFunction } from '@aws-amplify/backend';

export const handleIncomingCall = defineFunction({
  name: 'handleIncomingCall',
  entry: './handler.ts',
  environment: {
    // Add any environment variables needed
  }
});

// Add permissions for Amazon Connect to invoke this function
// Note: The actual permission will be set up when creating the Connect contact flow