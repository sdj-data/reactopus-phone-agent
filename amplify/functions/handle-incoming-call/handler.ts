import type { Handler } from 'aws-lambda';

// Import Gemini service (we'll need to copy it to the function folder or use a shared layer)
const sendToGemini = async (prompt: string): Promise<string> => {
  // TODO: Implement actual Gemini API integration
  console.log('Sending prompt to Gemini:', prompt);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return placeholder response
  return `This is a placeholder response from Gemini AI for the prompt: "${prompt}". The actual Gemini integration will be implemented later.`;
};

export const handler: Handler = async (event, context) => {
  console.log('Incoming call event:', JSON.stringify(event, null, 2));
  console.log('Lambda context:', JSON.stringify(context, null, 2));

  try {
    // Check if this is a Connect event
    if (event.Details && event.Details.ContactData) {
      // Handle Amazon Connect event
      const { Details: { ContactData } } = event;
      console.log('Processing Amazon Connect event');
      
      // Extract transcript from Connect event
      let transcript = '';
      
      // Try different places where transcript might be in Connect event
      if (ContactData.CustomerEndpoint && ContactData.CustomerEndpoint.Address) {
        transcript = ContactData.CustomerEndpoint.Address; // This is a placeholder - actual transcript location may vary
      } else if (event.Details.Parameters && event.Details.Parameters.transcript) {
        transcript = event.Details.Parameters.transcript;
      } else if (event.Details.Parameters && event.Details.Parameters.inputTranscript) {
        transcript = event.Details.Parameters.inputTranscript;
      } else if (ContactData.Attributes && ContactData.Attributes.transcript) {
        transcript = ContactData.Attributes.transcript;
      } else {
        // Default greeting for new calls
        transcript = "Hello, how can I help you today?";
      }

      console.log('Extracted transcript from Connect:', transcript);

      // Call Gemini with the transcript
      const geminiResponse = await sendToGemini(transcript);
      console.log('Gemini response:', geminiResponse);

      // Return response in Connect format
      return {
        ContentType: 'PlainText',
        Content: geminiResponse
      };
    }

    // Handle other event types (API Gateway, direct invocation, etc.)
    let transcript = '';
    
    // Handle different event structures that might contain transcript
    if (event.transcript) {
      transcript = event.transcript;
    } else if (event.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      transcript = body.transcript || body.text || body.message || '';
    } else if (event.Records && event.Records[0]) {
      // Handle SQS/SNS events
      const record = event.Records[0];
      if (record.body) {
        const recordBody = typeof record.body === 'string' ? JSON.parse(record.body) : record.body;
        transcript = recordBody.transcript || recordBody.text || recordBody.message || '';
      }
    } else {
      // Fallback: try to extract any text-like field
      transcript = event.text || event.message || event.input || '';
    }

    console.log('Extracted transcript:', transcript);

    if (!transcript) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'No transcript found in the incoming event',
          event: event,
          timestamp: new Date().toISOString()
        }),
      };
    }

    // Call Gemini with the transcript
    console.log('Calling Gemini with transcript:', transcript);
    const geminiResponse = await sendToGemini(transcript);
    console.log('Gemini response:', geminiResponse);

    // Return Gemini's response in API Gateway format
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: transcript,
        response: geminiResponse,
        timestamp: new Date().toISOString()
      }),
    };

    console.log('Final response:', JSON.stringify(response, null, 2));
    return response;

  } catch (error) {
    console.error('Error processing incoming call:', error);
    
    // Return error in appropriate format based on event type
    if (event.Details && event.Details.ContactData) {
      // Connect format error response
      return {
        ContentType: 'PlainText',
        Content: 'I apologize, but I encountered an error. Please try again or speak with a human agent.'
      };
    }
    
    // API Gateway format error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error while processing the call',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};