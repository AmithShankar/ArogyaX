export interface MonthlyThroughputData {
  month: string;
  visits: number;
}

export interface RevenuePulseData {
  month: string;
  revenue: number;
}

export interface SpecialtyMixData {
  name: string;
  value: number;
}

export interface UserEngagementData {
  visits: string;
  count: number;
}

export interface DashboardStats {
  totalPatients: number;
  totalUsers: number;
  totalVisits: number;
  totalRevenue: number;
  activePrescriptions: number;
}

export interface AdminAnalyticsData {
  monthlyVisits: MonthlyThroughputData[];
  revenueData: RevenuePulseData[];
  diagnosisData: SpecialtyMixData[];
  patientFrequency: UserEngagementData[];
}

export interface DashboardStat {
  label: string;
  value: string;
  icon: any; // LucideIcon
  color: string;
}
