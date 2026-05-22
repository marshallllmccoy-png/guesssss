export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  date: string;
  isPlayer?: boolean;
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, playerName: '地理达人王', score: 24850, date: '2026-05-20' },
  { rank: 2, playerName: '行走的中国地图', score: 24100, date: '2026-05-19' },
  { rank: 3, playerName: '山川湖海', score: 23750, date: '2026-05-18' },
  { rank: 4, playerName: '环游中国', score: 23200, date: '2026-05-17' },
  { rank: 5, playerName: '故乡的云', score: 22800, date: '2026-05-16' },
  { rank: 6, playerName: '背包客老张', score: 22100, date: '2026-05-15' },
  { rank: 7, playerName: '高铁侠', score: 21800, date: '2026-05-14' },
  { rank: 8, playerName: '南方姑娘', score: 21400, date: '2026-05-13' },
  { rank: 9, playerName: '长城守望者', score: 20900, date: '2026-05-12' },
  { rank: 10, playerName: '西域行者', score: 20500, date: '2026-05-11' },
];
