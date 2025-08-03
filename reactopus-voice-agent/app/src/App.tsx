import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('');

  const startCall = async () => {
    setIsStartingCall(true);
    setCallStatus('Initiating call...');
    
    try {
      const callId = uuidv4();
      const res = await fetch('/api/voice/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const { connectContactId } = await res.json();
      console.log('Contact started:', connectContactId);
      setCallStatus(`Call started successfully! Contact ID: ${connectContactId}`);
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(`Error starting call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsStartingCall(false);
    }
  };

  return (
    <main>
      <h1>Reactopus Voice Agent</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Voice Call Testing</h2>
        <button 
          onClick={startCall} 
          disabled={isStartingCall}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: isStartingCall ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isStartingCall ? 'not-allowed' : 'pointer'
          }}
        >
          {isStartingCall ? 'Starting Call...' : 'Start Call'}
        </button>
        {callStatus && (
          <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            Status: {callStatus}
          </p>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>About Reactopus Voice Agent</h2>
        <p>
          This is a bilingual (Spanish/English) AI-powered phone service that handles incoming calls naturally, 
          automatically detects caller language, conducts conversations using Google's Gemini 1.5 Flash LLM, 
          and seamlessly integrates with the Reactopus platform.
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul>
          <li>Natural voice conversations with AI</li>
          <li>Automatic language detection (Spanish/English)</li>
          <li>Meeting scheduling and calendar integration</li>
          <li>Real-time speech processing</li>
          <li>Amazon Connect integration</li>
        </ul>
      </div>
    </main>
  );
}

export default App;
