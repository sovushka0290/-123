export type DangerLevel = 'low' | 'medium' | 'high';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'leaks' | 'scams' | 'alerts' | 'advice';
  date: string;
  views: number;
  dangerLevel: DangerLevel;
  tag: string;
  source: string;
}

export interface FraudScheme {
  id: string;
  name: string;
  description: string;
  dangerLevel: DangerLevel;
  signs: string[];
  examples: string[];
  defenseTips: string[];
  tactics: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'passwords' | '2fa' | 'cards' | 'social' | 'mobile';
  readTime: string;
  content: string;
  steps: {
    title: string;
    description: string;
  }[];
  checklist: string[];
}

export interface UserReport {
  id: string;
  name?: string;
  type: string;
  description: string;
  contactInfo?: string;
  status: 'pending' | 'published' | 'approved';
  date: string;
  screenshot?: string; // Base64 or mock URL
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  iconName: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isThreatAnalysis?: boolean;
  analysisResults?: {
    riskScore: number; // 0 to 100
    detectedTriggers: string[];
    verdict: string;
    recommendations: string[];
  };
}
