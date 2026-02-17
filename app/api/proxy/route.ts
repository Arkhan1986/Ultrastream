import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge runtime for better streaming support
export const maxDuration = 60; // Allow up to 60 seconds for large playlists

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Enhanced headers to mimic a real browser
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Referer': new URL(url).origin,
        'Origin': new URL(url).origin,
        'DNT': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    if (!response.ok) {
      console.error(`Proxy fetch failed: ${response.status} ${response.statusText} for ${url}`);
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Detect content type from URL if not provided
    let contentType = response.headers.get('content-type');
    if (!contentType) {
      if (url.includes('.m3u8') || url.includes('.m3u')) {
        contentType = 'application/vnd.apple.mpegurl';
      } else if (url.includes('.ts')) {
        contentType = 'video/mp2t';
      } else if (url.includes('.mp4')) {
        contentType = 'video/mp4';
      } else {
        contentType = 'application/octet-stream';
      }
    }
    
    // Determine cache duration based on content type
    let cacheControl = 'public, max-age=3600'; // 1 hour default
    if (contentType.includes('mpegurl') || contentType.includes('m3u')) {
      cacheControl = 'public, max-age=1800'; // 30 minutes for playlists
    } else if (contentType.includes('video') || contentType.includes('stream')) {
      cacheControl = 'public, max-age=300'; // 5 minutes for video segments
    }

    // Stream the response directly instead of buffering
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
        'Cache-Control': cacheControl,
        'X-Proxy-Status': 'streaming',
        // Pass through content length if available
        ...(response.headers.get('content-length') && {
          'Content-Length': response.headers.get('content-length')!,
        }),
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    // Provide more detailed error information
    const errorMessage = error.name === 'AbortError' 
      ? 'Request timeout - stream took too long to respond'
      : error.message || 'Failed to proxy request';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.cause?.message || 'Unknown error',
        url: url 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Max-Age': '86400',
    },
  });
}
