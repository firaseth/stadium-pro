
import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ShieldCheck, 
  CircleDollarSign, 
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Users,
  FileText
} from 'lucide-react';
import { HealthStatus, PitchZone, InfrastructureComponent } from './types';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'turf', label: 'Turf Management', icon: <MapIcon size={20} /> },
  { id: 'infrastructure', label: 'Infrastructure', icon: <ShieldCheck size={20} /> },
  { id: 'financials', label: 'Financials', icon: <CircleDollarSign size={20} /> },
  { id: 'reporting', label: 'Media & Reporting', icon: <FileText size={20} /> },
  { id: 'ai-assistant', label: 'AI Assistant', icon: <Sparkles size={20} /> },
];

export const MOCK_PITCH_ZONES: PitchZone[] = Array.from({ length: 280 }).map((_, i) => ({
  id: `zone-${i}`,
  moisture: Math.floor(Math.random() * 30) + 10,
  density: Math.floor(Math.random() * 20) + 80,
  temperature: Math.floor(Math.random() * 5) + 20,
  status: i % 45 === 0 ? HealthStatus.CRITICAL : i % 15 === 0 ? HealthStatus.WARNING : HealthStatus.EXCELLENT
}));

export const INFRASTRUCTURE_DATA: InfrastructureComponent[] = [
  { name: 'Floodlight North', status: 'operational', lastChecked: '2h ago', metric: 'Intensity', value: '2000 lux' },
  { name: 'Floodlight South', status: 'maintenance', lastChecked: '1d ago', metric: 'Intensity', value: '1850 lux' },
  { name: 'HVAC Control Room', status: 'operational', lastChecked: '15m ago', metric: 'Temp', value: '21°C' },
  { name: 'Stand B Concrete', status: 'operational', lastChecked: '3d ago', metric: 'Integrity', value: '98%' },
  { name: 'Irrigation Pump A', status: 'fault', lastChecked: '5m ago', metric: 'Pressure', value: '0.5 bar' },
  { name: 'Backup Generator', status: 'operational', lastChecked: '1w ago', metric: 'Fuel', value: '92%' },
];

export const REVENUE_DATA = [
  { month: 'Aug', revenue: 4200000, costs: 1800000 },
  { month: 'Sep', revenue: 5500000, costs: 1850000 },
  { month: 'Oct', revenue: 4100000, costs: 1820000 },
  { month: 'Nov', revenue: 6800000, costs: 1900000 },
  { month: 'Dec', revenue: 8100000, costs: 1950000 },
];
