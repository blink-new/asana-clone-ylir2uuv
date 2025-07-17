import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // Handle CORS for frontend calls
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // For now, just acknowledge the analytics data without storing it
    // This prevents the network errors while keeping the app functional
    if (req.method === 'POST') {
      const body = await req.json();
      
      // Log analytics data for debugging (optional)
      console.log('Analytics data received:', {
        timestamp: new Date().toISOString(),
        events: body.events?.length || 0,
        projectId: body.projectId
      });

      // Return success response
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Analytics data received',
        processed: body.events?.length || 0
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Handle GET requests (health check)
    if (req.method === 'GET') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        service: 'analytics',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Analytics function error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});