'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    setError(null);
    setLoading(true);
    retryCountRef.current = 0;

    // Proxy wrapper function
    const proxyUrl = (url: string) => {
      // If URL is already proxied, return as-is
      if (url.includes('/api/proxy')) return url;
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    };

    if (Hls.isSupported()) {
      // HLS.js for browsers that don't support HLS natively
      const hls = new Hls({
        enableWorker: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: Infinity,
        liveDurationInfinity: false,
        liveBackBufferLength: Infinity,
        maxLiveSyncPlaybackRate: 1,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 1000,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 4,
        levelLoadingRetryDelay: 1000,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        startFragPrefetch: false,
        testBandwidth: true,
        progressive: false,
        lowLatencyMode: false,
        fpsDroppedMonitoringPeriod: 5000,
        fpsDroppedMonitoringThreshold: 0.2,
        appendErrorMaxRetry: 3,
        // Custom loader to proxy all requests
        loader: class CustomLoader extends Hls.DefaultConfig.loader {
          constructor(config: any) {
            super(config);
          }

          load(context: any, config: any, callbacks: any) {
            // Proxy all HLS requests (manifest and segments)
            const originalUrl = context.url;
            context.url = proxyUrl(originalUrl);
            
            console.log(`Loading through proxy: ${originalUrl}`);
            
            super.load(context, config, callbacks);
          }
        },
        xhrSetup: (xhr, url) => {
          // Don't send credentials for CORS requests
          xhr.withCredentials = false;
        },
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('Video element attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('Manifest loaded, found', data.levels.length, 'quality levels');
        setLoading(false);
        video.play().catch(err => {
          console.error('Autoplay failed:', err);
          setError('Click play to start');
        });
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log('Fragment loaded:', data.frag.relurl);
        retryCountRef.current = 0; // Reset retry count on successful load
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data.type, data.details, data);
        
        if (data.fatal) {
          setLoading(false);
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error encountered, trying to recover...');
              setError('Network error - trying to recover');
              
              if (retryCountRef.current < 5) {
                retryCountRef.current++;
                console.log(`Retry attempt ${retryCountRef.current}/5`);
                
                setTimeout(() => {
                  if (hlsRef.current) {
                    hlsRef.current.startLoad();
                  }
                }, 1000 * retryCountRef.current);
              } else {
                setError('Network error - max retries exceeded');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error encountered, trying to recover...');
              setError('Media error - trying to recover');
              hls.recoverMediaError();
              break;
              
            default:
              console.error('Fatal error, cannot recover');
              setError('Fatal error - cannot play stream');
              hls.destroy();
              break;
          }
        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          // Non-fatal network error
          console.warn('Non-fatal network error:', data.details);
          if (data.details === 'fragLoadError' || data.details === 'manifestLoadError') {
            setError('Loading issue - retrying...');
          }
        }
      });

      // Load the source through proxy
      hls.loadSource(proxyUrl(src));
      hls.attachMedia(video);

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = proxyUrl(src);
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().catch(err => {
          console.error('Autoplay failed:', err);
          setError('Click play to start');
        });
      });
      video.addEventListener('error', () => {
        setLoading(false);
        setError('Failed to load video');
      });
    } else {
      setLoading(false);
      setError('HLS is not supported in this browser');
    }
  }, [src]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
      {title && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        playsInline
        autoPlay
        muted
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-lg">Loading stream...</div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-16 left-0 right-0 mx-4 p-3 bg-red-600/90 text-white rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
}
