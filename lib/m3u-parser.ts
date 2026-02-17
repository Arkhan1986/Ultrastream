export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n').map(line => line.trim());
  const channels: Channel[] = [];
  
  let currentChannel: Partial<Channel> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentChannel = {
        id: `channel-${i}`,
        name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
        logo: logoMatch ? logoMatch[1] : undefined,
        group: groupMatch ? groupMatch[1] : 'Uncategorized',
      };
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the stream URL
      currentChannel.url = line;
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  }
  
  return channels;
}

export function groupChannels(channels: Channel[]): Record<string, Channel[]> {
  return channels.reduce((acc, channel) => {
    const group = channel.group || 'Uncategorized';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);
}
