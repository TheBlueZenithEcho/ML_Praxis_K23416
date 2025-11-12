// Sentiment analysis types
export enum SentimentType {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

// Time period for analytics
export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

// Designer KPI (Key Performance Indicators)
export interface DesignerKPI {
  designerId: string;
  designerName: string;
  period: TimePeriod;
  startDate: string;
  endDate: string;
  
  // Lead metrics
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  cancelledLeads: number;
  conversionRate: number; // percentage
  
  // Project metrics
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  cancelledProjects: number;
  
  // Response metrics
  averageResponseTime: number; // minutes
  firstResponseTime: number; // minutes
  totalMessages: number;
  
  // Quality metrics
  averageRevisions: number;
  customerSatisfactionScore: number; // 0-5
  totalRevisionRequests: number;
  
  // Financial metrics
  totalRevenue: number;
  averageProjectValue: number;
  quoteAcceptanceRate: number; // percentage
  
  // Sentiment metrics
  sentimentDistribution: SentimentDistribution;
}

// Customer sentiment distribution
export interface SentimentDistribution {
  positive: number; // percentage
  neutral: number; // percentage
  negative: number; // percentage
  totalAnalyzed: number; // total messages analyzed
}

// Sentiment analysis result
export interface SentimentAnalysis {
  messageId: string;
  chatId: string;
  content: string;
  sentiment: SentimentType;
  score: number; // confidence score 0-1
  keywords?: string[]; // extracted keywords
  analyzedAt: string;
}

// Sentiment trend over time
export interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  totalMessages: number;
}

// Funnel analysis for conversion tracking
export interface ConversionFunnel {
  period: TimePeriod;
  startDate: string;
  endDate: string;
  
  stages: FunnelStage[];
  overallConversionRate: number; // percentage
}

export interface FunnelStage {
  stageName: string;
  count: number;
  percentage: number; // of total at start
  dropoffRate: number; // percentage lost from previous stage
}

// Keyword analysis from customer messages
export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  sentiment: SentimentType;
  relatedTopics?: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Designer performance comparison
export interface DesignerComparison {
  designerId: string;
  designerName: string;
  rank: number;
  
  metrics: {
    conversionRate: number;
    responseTime: number;
    satisfactionScore: number;
    totalRevenue: number;
  };
  
  percentileRank: number; // 0-100
}

// Admin dashboard analytics
export interface AdminDashboard {
  period: TimePeriod;
  startDate: string;
  endDate: string;
  
  // Overall metrics
  totalDesigners: number;
  activeDesigners: number;
  totalCustomers: number;
  activeCustomers: number;
  
  // Business metrics
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  
  // Conversion metrics
  funnelAnalysis: ConversionFunnel;
  
  // Sentiment overview
  overallSentiment: SentimentDistribution;
  sentimentTrends: SentimentTrend[];
  
  // Popular keywords
  topKeywords: KeywordAnalysis[];
  
  // Designer performance
  topDesigners: DesignerComparison[];
  
  // Growth metrics
  leadGrowth: number; // percentage change
  revenueGrowth: number; // percentage change
  customerGrowth: number; // percentage change
}

// Time series data for charts
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// Chart data structure
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

// Analytics filters
export interface AnalyticsFilters {
  period: TimePeriod;
  startDate?: string;
  endDate?: string;
  designerId?: string;
  customerId?: string;
  projectStatus?: string;
  leadStatus?: string;
}

// Export data request
export interface ExportAnalyticsDTO {
  filters: AnalyticsFilters;
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean;
}