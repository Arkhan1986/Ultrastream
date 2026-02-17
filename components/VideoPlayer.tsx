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

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    setError(null);
    setLoading(true);

    // Use proxy for all streams
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(src)}`;

    if (Hls.isSupported()) {
      // HLS.js for browsers that don't support HLS natively
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false;
        },
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('Video element attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest loaded, starting playback');
        setLoading(false);
        video.play().catch(err => {
          console.error('Autoplay failed:', err);
          setError('Click play to start');
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          setLoading(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - trying to recover');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error - cannot play stream');
              hls.destroy();
              break;
          }
        }
      });

      hls.loadSource(proxyUrl);
      hls.attachMedia(video);

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = proxyUrl;
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
