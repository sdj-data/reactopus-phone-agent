export const REGION = "us-east-1";
export const CONNECT_INSTANCE_ID = "<YOUR_INSTANCE_ID>";
export const LAMBDA_FUNCTION_NAME = "handleIncomingCall";

// Default Amplify configuration for build environment
// Using minimal configuration that Amplify accepts
const defaultConfig = {
  auth: {
    aws_region: REGION,
    user_pool_id: "us-east-1_placeholder",
    user_pool_client_id: "placeholder_client_id",
    identity_pool_id: "us-east-1:placeholder-identity-pool"
  }
};

// For now, use the default configuration
// In a real deployment, this would be replaced by the actual amplify_outputs.json content
export const awsConfig = defaultConfig;