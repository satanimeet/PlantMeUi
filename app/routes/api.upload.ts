import type { Route } from "./+types/api.upload";

const FASTAPI_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const sessionId = formData.get('sessionId') as string;
    
    if (!imageFile) {
      return new Response(JSON.stringify({ 
        error: 'No image file provided' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Create FormData for FastAPI
    const fastApiFormData = new FormData();
    fastApiFormData.append('file', imageFile);
    if (sessionId) {
      fastApiFormData.append('uid', sessionId);
    }

    // Call FastAPI predictscore endpoint
    const response = await fetch(`${FASTAPI_BASE_URL}/predictscore`, {
      method: 'POST',
      body: fastApiFormData,
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.status}`);
    }

    const predictionData = await response.json();
    
    // Use the message from FastAPI response
    const analysis = {
      disease: predictionData.predicted_class,
      message: predictionData.message || predictionData.predicted_class,
      confidence: predictionData.confidence,
      severity: predictionData.confidence_level,
      symptoms: [
        "Based on the image analysis",
        "Visual symptoms detected",
        "Requires further examination"
      ],
      treatment: [
        "Consult with a plant specialist",
        "Apply appropriate treatment based on diagnosis",
        "Monitor plant health regularly"
      ],
      prevention: [
        "Maintain proper plant hygiene",
        "Ensure adequate spacing and air circulation",
        "Regular monitoring and early intervention"
      ]
    };

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      filename: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      stored: predictionData.stored
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
