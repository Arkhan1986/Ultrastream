'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelSidebar from '@/components/ChannelSidebar';
import { Channel, parseM3U, groupChannels } from '@/lib/m3u-parser';
import { useRouter } from 'next/navigation';

export default function PlayerPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [channels, setChannels] = useState<Record<string, Channel[]>>({});
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Demo mode: Allow access without authentication for testing
    // if (!user) {
    //   router.push('/');
    // }
  }, [user, router]);

  const loadPlaylist = async () => {
    if (!playlistUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(playlistUrl)}`);
      const text = await response.text();
      const parsedChannels = parseM3U(text);
      const grouped = groupChannels(parsedChannels);
      setChannels(grouped);
      
      // Auto-select first channel
      const firstGroup = Object.values(grouped)[0];
      if (firstGroup && firstGroup.length > 0) {
        setSelectedChannel(firstGroup[0]);
      }
    } catch (error) {
      console.error('Failed to load playlist:', error);
      alert('Failed to load playlist. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleUpgradeToPro = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  // Demo mode enabled
  // if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">UltraStream</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleUpgradeToPro}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            Upgrade to Pro - $9.99/mo
          </button>
          <span className="text-gray-400 text-sm">{user?.email || 'Demo Mode'}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Playlist Input */}
      {Object.keys(channels).length === 0 && (
        <div className="p-6 bg-gray-900 border-b border-gray-800">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Enter M3U/M3U8 playlist URL..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              onClick={loadPlaylist}
              disabled={loading || !playlistUrl}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Load Playlist'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && Object.keys(channels).length > 0 && (
          <aside className="w-80 border-r border-gray-800 overflow-hidden">
            <ChannelSidebar
              channels={channels}
              onChannelSelect={setSelectedChannel}
              selectedChannel={selectedChannel || undefined}
            />
          </aside>
        )}

        {/* Player Area */}
        <main className="flex-1 flex items-center justify-center p-6 bg-gray-950">
          {selectedChannel ? (
            <div className="w-full max-w-6xl">
              <VideoPlayer src={selectedChannel.url} title={selectedChannel.name} />
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-xl">Load a playlist to start watching</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
