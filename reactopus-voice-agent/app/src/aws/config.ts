export const REGION = "us-east-1";
export const CONNECT_INSTANCE_ID = "<YOUR_INSTANCE_ID>";
export const LAMBDA_FUNCTION_NAME = "handleIncomingCall";

// Type definition for Amplify configuration
interface AmplifyConfig {
  auth: {
    aws_region: string;
    user_pool_id?: string;
    user_pool_client_id?: string;
    identity_pool_id?: string;
  };
  data?: {
    aws_region: string;
    url?: string;
    api_key?: string;
    default_authorization_type?: string;
  };
}

// Default Amplify configuration for build environment
const defaultConfig: AmplifyConfig = {
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

// For now, use the default configuration
// In a real deployment, this would be replaced by the actual amplify_outputs.json content
export const awsConfig: AmplifyConfig = defaultConfig;