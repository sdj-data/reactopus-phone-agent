import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== REACTOPUS VOICE AGENT DATA SCHEMA =====================================
This schema defines the data models for the Reactopus Voice Agent.
Currently using minimal schema for voice call management.
For future expansion: call logs, conversation history, user preferences, etc.
=========================================================================*/

const schema = a.schema({
  CallLog: a
    .model({
      id: a.id(),
      callId: a.string().required(),
      status: a.string().required(),
      timestamp: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
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
