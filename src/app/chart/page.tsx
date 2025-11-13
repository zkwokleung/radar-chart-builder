'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RadarChartWidget from '@/components/radar-chart-widget';

interface RadarDataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
  title: string;
  backgroundColor: string;
  chartColor: string;
  dataPoints: RadarDataPoint[];
}

function ChartContent() {
  const searchParams = useSearchParams();
  const configParam = searchParams.get('config');

  let config: ChartConfig = {
    title: 'Radar Chart',
    backgroundColor: '#0f172a',
    chartColor: '#3b82f6',
    dataPoints: [
      { label: 'Metric 1', value: 80 },
      { label: 'Metric 2', value: 70 },
      { label: 'Metric 3', value: 85 },
    ],
  };

  if (configParam) {
    try {
      config = JSON.parse(atob(configParam));
    } catch (e) {
      console.error('Failed to parse config:', e);
    }
  }

  return (
    <div
      style={{ backgroundColor: config.backgroundColor }}
      className='flex h-screen w-screen items-center justify-center overflow-hidden'
    >
      <RadarChartWidget config={config} />
    </div>
  );
}

export default function ChartPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center bg-slate-900'>
          Loading...
        </div>
      }
    >
      <ChartContent />
    </Suspense>
  );
}
