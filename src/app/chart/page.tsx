'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import RadarChartWidget from '@/components/radar-chart-widget';
import type { ChartConfig } from '@/types/chart-config';

const defaultConfig: ChartConfig = {
  title: 'Stats',
  backgroundColor: '#1b1d24',
  chartColor: '#d97706',
  textColor: '#fef3c7',
  gridColor: 'rgba(252, 211, 77, 0.2)',
  axisColor: 'rgba(249, 115, 22, 0.7)',
  dataPoints: [
    { label: 'Strength', value: 80 },
    { label: 'Dexterity', value: 70 },
    { label: 'Constitution', value: 75 },
    { label: 'Intelligence', value: 60 },
    { label: 'Wisdom', value: 65 },
    { label: 'Charisma', value: 85 },
  ],
  titleFontSize: 32,
  labelFontSize: 14,
  showGrid: true,
  showAxis: true,
  chartOpacity: 0.6,
  strokeWidth: 2,
  showRadiusAxis: true,
  titleFontFamily: 'system-ui',
  labelFontFamily: 'system-ui',
};

function ChartContent() {
  const searchParams = useSearchParams();
  const configParam = searchParams.get('config');

  const config = useMemo(() => {
    if (!configParam) return defaultConfig;
    try {
      const parsed = JSON.parse(atob(configParam)) as Partial<ChartConfig>;
      return {
        ...defaultConfig,
        ...parsed,
        dataPoints: parsed.dataPoints ?? defaultConfig.dataPoints,
      };
    } catch (e) {
      console.error('Failed to parse config:', e);
      return defaultConfig;
    }
  }, [configParam]);

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
