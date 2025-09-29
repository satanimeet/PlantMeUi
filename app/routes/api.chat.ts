import type { Route } from "./+types/api.chat";

const FASTAPI_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function action({ request }: Route.ActionArgs) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let message, mode, type, sessionId;

    // Handle both JSON and FormData requests
    let originalFormData;
    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ message, mode, type, sessionId } = body);
    } else {
      // Handle FormData (for audio uploads)
      originalFormData = await request.formData();
      message = originalFormData.get('message') as string || originalFormData.get('queastion') as string || '';
      mode = originalFormData.get('mode') as string || 'plant-disease';
      type = originalFormData.get('type') as string || 'audio';
      sessionId = originalFormData.get('sessionId') as string || originalFormData.get('uid') as string;
    }

    let response = '';
    
    if (mode === 'plant-disease') {
      // Call FastAPI queastionAnswer endpoint for plant disease queries
      const fastApiFormData = new FormData();
      fastApiFormData.append('queastion', message || '');
      if (sessionId) {
        fastApiFormData.append('uid', sessionId);
      }
      
      // If it's an audio request, forward the audio file to FastAPI
      if (type === 'audio' && originalFormData) {
        const audioFile = originalFormData.get('audio') as File;
        if (audioFile) {
          fastApiFormData.append('audio', audioFile);
        }
      }
      
      const fastApiResponse = await fetch(`${FASTAPI_BASE_URL}/queastionAnswer`, {
        method: 'POST',
        body: fastApiFormData,
      });

      if (fastApiResponse.ok) {
        try {
          const data = await fastApiResponse.json();
          console.log('Received from FastAPI:', data);
          // Simply pass through whatever answer we get from FastAPI
          response = data.answer || 'No response received';
          console.log('Setting response to:', response);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          response = 'Sorry, I received an invalid response from the plant disease service. Please try again.';
        }
      } else {
        response = 'Sorry, I couldn\'t connect to the plant disease analysis service. Please try again later.';
      }
    } else {
      // For general chat, we can use the same endpoint but without disease context
      const formData = new FormData();
      formData.append('queastion', message);
      if (sessionId) {
        formData.append('uid', sessionId);
      }
      
      const fastApiResponse = await fetch(`${FASTAPI_BASE_URL}/queastionAnswer`, {
        method: 'POST',
        body: formData,
      });

      if (fastApiResponse.ok) {
        try {
          const data = await fastApiResponse.json();
          // Simply pass through whatever answer we get from FastAPI
          response = data.answer || 'No response received';
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          response = 'Sorry, I received an invalid response from the chat service. Please try again.';
        }
      } else {
        response = 'Sorry, I couldn\'t connect to the chat service. Please try again later.';
      }
    }

    console.log('Final response being sent to frontend:', response);
    return new Response(JSON.stringify({ answer: response }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      answer: 'Sorry, there was an error processing your request.' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
