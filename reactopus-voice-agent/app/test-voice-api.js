#!/usr/bin/env node

// Simple test script for the voice API endpoint
// Run this after deploying with: node test-voice-api.js

const { v4: uuidv4 } = require('uuid');

async function testVoiceAPI() {
  const callId = uuidv4();
  
  // Replace this URL with your actual API Gateway endpoint after deployment
  const apiUrl = 'YOUR_API_GATEWAY_URL/api/voice/start';
  
  console.log('Testing Voice API with callId:', callId);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ callId })
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Voice API test successful!');
      console.log('Connect Contact ID:', result.connectContactId);
    } else {
      console.log('❌ Voice API test failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing Voice API:', error.message);
  }
}

// Run the test
testVoiceAPI();