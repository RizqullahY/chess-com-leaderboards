export function countryToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

export function formatRating(rating?: number): string {
  if (!rating) return 'Unrated';
  return rating.toString();
}

export function formatLastOnline(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 300) return 'Online now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return 'Long time ago';
}

export function getChessIcon(category: string): string {
  const icons: Record<string, string> = {
    daily: '♔',
    live_rapid: '♕',
    live_blitz: '♖',
    live_bullet: '♗',
    live_bughouse: '♘',
    live_blitz960: '♙',
    tactics: '🧩',
    rush: '⚡',
    battle: '⚔️'
  };
  return icons[category] || '♔';
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    daily: 'Daily Chess',
    live_rapid: 'Rapid',
    live_blitz: 'Blitz',
    live_bullet: 'Bullet',
    live_bughouse: 'Bughouse',
    live_blitz960: 'Chess960',
    live_threecheck: 'Three-Check',
    live_crazyhouse: 'Crazyhouse',
    live_kingofthehill: 'King of the Hill',
    tactics: 'Tactics',
    rush: 'Puzzle Rush',
    battle: 'Puzzle Battle'
  };
  return names[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}