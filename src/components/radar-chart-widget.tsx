'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { ChartConfig } from '@/types/chart-config';

interface RadarChartWidgetProps {
  config: ChartConfig;
}

export default function RadarChartWidget({ config }: RadarChartWidgetProps) {
  const data = config.dataPoints.map((point) => ({
    name: point.label,
    value: point.value,
    fullMark: 100,
  }));

  return (
    <div className='flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8'>
      <div
        style={{ backgroundColor: config.backgroundColor }}
        className='flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg p-6 shadow-2xl'
      >
        <h2
          className='mb-4 text-center font-bold text-balance sm:mb-6'
          style={{
            color: config.textColor,
            fontSize: `${config.titleFontSize}px`,
            fontFamily: config.titleFontFamily,
          }}
        >
          {config.title}
        </h2>
        <div className='flex min-h-0 w-full flex-1 items-center justify-center'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={data}>
              {config.showGrid && <PolarGrid stroke={config.gridColor} />}
              {config.showAxis && (
                <PolarAngleAxis
                  dataKey='name'
                  stroke={config.axisColor}
                  style={{
                    fontSize: `${config.labelFontSize}px`,
                    fontFamily: config.labelFontFamily,
                  }}
                />
              )}
              {config.showRadiusAxis && (
                <PolarRadiusAxis stroke={config.axisColor} />
              )}
              <Radar
                name='Value'
                dataKey='value'
                stroke={config.chartColor}
                fill={config.chartColor}
                fillOpacity={config.chartOpacity}
                strokeWidth={config.strokeWidth}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
