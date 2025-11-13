export interface RadarDataPoint {
  label: string;
  value: number;
}

export interface ChartConfig {
  title: string;
  backgroundColor: string;
  chartColor: string;
  textColor: string;
  gridColor: string;
  axisColor: string;
  dataPoints: RadarDataPoint[];
  titleFontSize: number;
  labelFontSize: number;
  showGrid: boolean;
  showAxis: boolean;
  chartOpacity: number;
  strokeWidth: number;
  showRadiusAxis: boolean;
  titleFontFamily: string;
  labelFontFamily: string;
}
