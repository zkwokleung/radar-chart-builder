"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface RadarDataPoint {
  label: string
  value: number
}

interface RadarChartPreviewProps {
  title: string
  dataPoints: RadarDataPoint[]
  backgroundColor: string
  chartColor: string
  textColor: string
  gridColor: string
  axisColor: string
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

export default function RadarChartPreview({
  title,
  dataPoints,
  backgroundColor,
  chartColor,
  textColor,
  gridColor,
  axisColor,
  titleFontSize,
  labelFontSize,
  showGrid,
  showAxis,
  chartOpacity,
  strokeWidth,
  showRadiusAxis,
  titleFontFamily,
  labelFontFamily,
}: RadarChartPreviewProps) {
  const data = dataPoints.map((point) => ({
    name: point.label,
    value: point.value,
    fullMark: 100,
  }))

  return (
    <div
      style={{ backgroundColor }}
      className="w-full rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center"
    >
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{
          color: textColor,
          fontSize: `${titleFontSize}px`,
          fontFamily: titleFontFamily,
        }}
      >
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          {showGrid && <PolarGrid stroke={gridColor} />}
          {showAxis && (
            <PolarAngleAxis
              dataKey="name"
              stroke={axisColor}
              style={{
                fontSize: `${labelFontSize}px`,
                fontFamily: labelFontFamily,
              }}
            />
          )}
          {showRadiusAxis && <PolarRadiusAxis stroke={axisColor} />}
          <Radar
            name="Value"
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={chartOpacity}
            strokeWidth={strokeWidth}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
