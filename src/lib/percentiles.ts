const PERCENTILE_THRESHOLDS = [
  { percentile: 99, minScore: 23500 },
  { percentile: 95, minScore: 21000 },
  { percentile: 90, minScore: 18500 },
  { percentile: 80, minScore: 15000 },
  { percentile: 70, minScore: 12500 },
  { percentile: 60, minScore: 10000 },
  { percentile: 50, minScore: 8000 },
  { percentile: 40, minScore: 6000 },
  { percentile: 30, minScore: 4000 },
  { percentile: 20, minScore: 2500 },
  { percentile: 10, minScore: 1000 },
];

export function getPercentile(totalScore: number): number {
  for (const t of PERCENTILE_THRESHOLDS) {
    if (totalScore >= t.minScore) return t.percentile;
  }
  return 5;
}

export function getGrade(totalScore: number): { grade: string; label: string; color: string } {
  if (totalScore >= 22000) return { grade: 'S', label: '中国地理专家', color: '#fbbf24' };
  if (totalScore >= 16000) return { grade: 'A', label: '见多识广', color: '#22d3ee' };
  if (totalScore >= 10000) return { grade: 'B', label: '还算熟悉', color: '#60a5fa' };
  if (totalScore >= 5000) return { grade: 'C', label: '仍需努力', color: '#a78bfa' };
  if (totalScore >= 1000) return { grade: 'D', label: '祖国这么大去看看', color: '#f472b6' };
  return { grade: 'F', label: '该出门走走了', color: '#ef4444' };
}
