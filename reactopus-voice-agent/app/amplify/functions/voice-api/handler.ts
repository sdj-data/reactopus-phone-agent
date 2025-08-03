import type { APIGatewayProxyHandler } from 'aws-lambda';
import { ConnectClient, StartOutboundVoiceContactCommand } from '@aws-sdk/client-connect';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const REGION = process.env.AWS_REGION || 'us-east-1';
const CONNECT_INSTANCE_ID = process.env.CONNECT_INSTANCE_ID || '<YOUR_INSTANCE_ID>';
const GEMINI_API_KEY_PARAM = process.env.GEMINI_API_KEY_PARAM || '/reactopus/voice/GEMINI_API_KEY';

const connectClient = new ConnectClient({ region: REGION });
const ssmClient = new SSMClient({ region: REGION });

// Cache for API key to avoid repeated SSM calls
let cachedGeminiApiKey: string | null = null;

async function getGeminiApiKey(): Promise<string> {
  if (cachedGeminiApiKey) {
    return cachedGeminiApiKey;
  }

  try {
    const command = new GetParameterCommand({
      Name: GEMINI_API_KEY_PARAM,
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    cachedGeminiApiKey = response.Parameter?.Value || '';
    return cachedGeminiApiKey;
  } catch (error) {
    console.error('Failed to retrieve Gemini API key from SSM:', error);
    throw new Error('Gemini API key not configured');
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Voice API event:', JSON.stringify(event, null, 2));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate API Key (API Gateway handles this, but we can add additional validation)
  const apiKey = event.headers['X-API-Key'] || event.headers['x-api-key'];
  if (!apiKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'API key required' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { callId, message } = body;

    if (!callId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'callId is required' })
      };
    }

    console.log('Starting voice processing for callId:', callId);

    // Get Gemini API key from SSM
    const geminiApiKey = await getGeminiApiKey();
    console.log('Gemini API key retrieved successfully');

    // Here you can add Gemini API integration
    // For now, we'll just confirm the key is available
    const geminiStatus = geminiApiKey ? 'configured' : 'not configured';

    // For demonstration purposes, we'll simulate starting a contact
    // In a real implementation, you would use StartOutboundVoiceContactCommand
    // to initiate an actual call to a phone number
    
    // Simulate the API call for now
    const simulatedContactId = `contact-${callId}-${Date.now()}`;
    
    // TODO: Implement actual Connect outbound call
    // const command = new StartOutboundVoiceContactCommand({
    //   InstanceId: CONNECT_INSTANCE_ID,
    //   ContactFlowId: 'YOUR_CONTACT_FLOW_ID',
    //   DestinationPhoneNumber: '+1234567890', // This would come from the request
    //   SourcePhoneNumber: '+0987654321', // Your Connect phone number
    //   Attributes: {
    //     callId: callId
    //   }
    // });
    // 
    // const response = await connectClient.send(command);
    // const connectContactId = response.ContactId;

    console.log('Contact started successfully:', simulatedContactId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        callId,
        connectContactId: simulatedContactId,
        geminiApiStatus: geminiStatus,
        message: 'Voice contact initiated successfully (simulated)',
        receivedMessage: message || 'No message provided',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error starting voice contact:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};