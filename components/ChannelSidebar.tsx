'use client';

import { useState } from 'react';
import { Channel } from '@/lib/m3u-parser';

interface ChannelSidebarProps {
  channels: Record<string, Channel[]>;
  onChannelSelect: (channel: Channel) => void;
  selectedChannel?: Channel;
}

export default function ChannelSidebar({ channels, onChannelSelect, selectedChannel }: ChannelSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(Object.keys(channels).slice(0, 1)));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredChannels = Object.entries(channels).reduce((acc, [group, channelList]) => {
    const filtered = channelList.filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredChannels).map(([group, channelList]) => (
          <div key={group} className="border-b border-gray-800">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <span className="font-semibold text-sm uppercase tracking-wider text-gray-300">
                {group}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{channelList.length}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedGroups.has(group) ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Channel Items */}
            {expandedGroups.has(group) && (
              <div className="bg-gray-900">
                {channelList.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors ${
                      selectedChannel?.id === channel.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                  >
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm text-left flex-1 truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
