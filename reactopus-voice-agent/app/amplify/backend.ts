import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { voiceApi } from './functions/voice-api/resource';

const backend = defineBackend({
  auth,
  data,
  voiceApi,
});
