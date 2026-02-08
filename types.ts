
export enum HealthStatus {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface PitchZone {
  id: string;
  moisture: number;
  density: number;
  temperature: number;
  status: HealthStatus;
}

export interface StadiumStats {
  readinessScore: number;
  activeAlerts: number;
  revenueMatch: number;
  operationalCost: number;
  turfHealth: number;
}

export interface InfrastructureComponent {
  name: string;
  status: 'operational' | 'maintenance' | 'fault';
  lastChecked: string;
  metric: string;
  value: string;
}

export type ViewType = 'overview' | 'turf' | 'infrastructure' | 'financials' | 'ai-assistant' | 'reporting';
