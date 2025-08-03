import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== REACTOPUS VOICE AGENT DATA SCHEMA =====================================
This schema defines the data models for the Reactopus Voice Agent.
Currently using minimal schema for voice call management.
For future expansion: call logs, conversation history, user preferences, etc.
=========================================================================*/

const schema = a.schema({
  // Future models for voice agent functionality:
  // CallLog: a.model({ ... })
  // ConversationHistory: a.model({ ... })
  // UserPreferences: a.model({ ... })
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
