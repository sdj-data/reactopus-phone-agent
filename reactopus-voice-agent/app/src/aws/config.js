export const REGION = "us-east-1";
export const CONNECT_INSTANCE_ID = "<YOUR_INSTANCE_ID>";
export const LAMBDA_FUNCTION_NAME = "handleIncomingCall";

// Amplify configuration with fallback for missing amplify_outputs.json
let amplifyOutputs = {};

try {
  // Try to import the backend-generated configuration
  amplifyOutputs = require("../../amplify_outputs.json");
} catch (error) {
  console.warn("amplify_outputs.json not found, using minimal configuration for build");
  // Minimal configuration that allows the app to build without backend
  amplifyOutputs = {
    auth: {
      aws_region: REGION,
      user_pool_id: "",
      user_pool_client_id: "",
      identity_pool_id: ""
    },
    data: {
      aws_region: REGION,
      url: "",
      api_key: "",
      default_authorization_type: "API_KEY"
    }
  };
}

export const awsConfig = amplifyOutputs;