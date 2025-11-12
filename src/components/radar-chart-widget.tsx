"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface RadarDataPoint {
  label: string
  value: number
}

interface ChartConfig {
  title: string
  backgroundColor: string
  chartColor: string
  textColor: string
  gridColor: string
  axisColor: string
  dataPoints: RadarDataPoint[]
  titleFontSize: number
  labelFontSize: number
  showGrid: boolean
  showAxis: boolean
  chartOpacity: number
  strokeWidth: number
  showRadiusAxis: boolean
  titleFontFamily: string
  labelFontFamily: string
}

interface RadarChartWidgetProps {
  config: ChartConfig
}

export default function RadarChartWidget({ config }: RadarChartWidgetProps) {
  const data = config.dataPoints.map((point) => ({
    name: point.label,
    value: point.value,
    fullMark: 100,
  }))

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div
        style={{ backgroundColor: config.backgroundColor }}
        className="w-full h-full rounded-lg overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6"
      >
        <h2
          className="font-bold mb-4 sm:mb-6 text-center text-balance"
          style={{ color: config.textColor, fontSize: `${config.titleFontSize}px`, fontFamily: config.titleFontFamily }}
        >
          {config.title}
        </h2>
        <div className="w-full flex-1 flex items-center justify-center min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              {config.showGrid && <PolarGrid stroke={config.gridColor} />}
              {config.showAxis && (
                <PolarAngleAxis
                  dataKey="name"
                  stroke={config.axisColor}
                  style={{ fontSize: `${config.labelFontSize}px`, fontFamily: config.labelFontFamily }}
                />
              )}
              {config.showRadiusAxis && <PolarRadiusAxis stroke={config.axisColor} />}
              <Radar
                name="Value"
                dataKey="value"
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
  )
}
