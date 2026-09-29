import { Department } from '../types';

interface SuggestionResult {
  suggestedDepartment: Department | null;
  matchedKeywords: string[];
}

const KEYWORD_MAP: Record<Department, string[]> = {
  'Street Lights': [
    'street light',
    'streetlight',
    'lamp',
    'dark road',
    'bulb',
    'lighting',
    'light pole',
    'night light',
    'street lamp',
    'darkness',
    'broken light'
  ],
  'Water Supply': [
    'water',
    'pipe',
    'leaking',
    'leak',
    'tap',
    'pipeline',
    'water supply',
    'no water',
    'contamination',
    'water shortage',
    'low pressure',
    'tanker'
  ],
  Roads: [
    'pothole',
    'road',
    'tar',
    'asphalt',
    'crack',
    'footpath',
    'divider',
    'speed breaker',
    'road damage',
    'manhole cover',
    'pavement'
  ],
  'Waste Management': [
    'garbage',
    'dump',
    'trash',
    'waste',
    'bin',
    'cleanliness',
    'litter',
    'rubbish',
    'sweeping',
    'waste collection',
    'smell',
    'odor',
    'dustbin'
  ],
  Drainage: [
    'drain',
    'sewage',
    'gutter',
    'waterlogging',
    'blocked drain',
    'overflow',
    'stagnant',
    'drainage',
    'flooding',
    'foul water'
  ],
  Electricity: [
    'electric',
    'electricity',
    'pole',
    'wire',
    'voltage',
    'transformer',
    'sparks',
    'power cut',
    'outage',
    'short circuit',
    'current',
    'feeder'
  ],
  Other: ['other', 'general', 'misc', 'noise', 'animal', 'encroachment']
};

export function suggestDepartment(text: string): SuggestionResult {
  if (!text || text.trim().length < 3) {
    return { suggestedDepartment: null, matchedKeywords: [] };
  }

  const lowerText = text.toLowerCase();
  const departmentScores: Record<Department, { score: number; keywords: string[] }> = {
    'Street Lights': { score: 0, keywords: [] },
    'Water Supply': { score: 0, keywords: [] },
    Roads: { score: 0, keywords: [] },
    'Waste Management': { score: 0, keywords: [] },
    Drainage: { score: 0, keywords: [] },
    Electricity: { score: 0, keywords: [] },
    Other: { score: 0, keywords: [] }
  };

  (Object.keys(KEYWORD_MAP) as Department[]).forEach((dept) => {
    const keywords = KEYWORD_MAP[dept];
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        departmentScores[dept].score += 1;
        if (!departmentScores[dept].keywords.includes(keyword)) {
          departmentScores[dept].keywords.push(keyword);
        }
      }
    });
  });

  let maxScore = 0;
  let bestDept: Department | null = null;
  let matchedKw: string[] = [];

  (Object.keys(departmentScores) as Department[]).forEach((dept) => {
    if (departmentScores[dept].score > maxScore) {
      maxScore = departmentScores[dept].score;
      bestDept = dept;
      matchedKw = departmentScores[dept].keywords;
    }
  });

  return {
    suggestedDepartment: bestDept,
    matchedKeywords: matchedKw
  };
}
