import type { APIGatewayProxyHandler } from 'aws-lambda';
import { ConnectClient, StartOutboundVoiceContactCommand } from '@aws-sdk/client-connect';
// Note: In a Lambda function, we'll get these from environment variables instead
const REGION = process.env.AWS_REGION || 'us-east-1';
const CONNECT_INSTANCE_ID = process.env.CONNECT_INSTANCE_ID || '<YOUR_INSTANCE_ID>';

const connectClient = new ConnectClient({ region: REGION });

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Voice API event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { callId } = body;

    if (!callId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'callId is required' })
      };
    }

    console.log('Starting outbound contact for callId:', callId);

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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        callId,
        connectContactId: simulatedContactId,
        message: 'Voice contact initiated successfully (simulated)',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error starting voice contact:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};