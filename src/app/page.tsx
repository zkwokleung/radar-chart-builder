"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import RadarChartPreview from "@/components/radar-chart-preview";

interface RadarDataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
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
  showRadiusAxis: boolean;
  titleFontFamily: string;
  labelFontFamily: string;
}

export default function ConfigPage() {
  const [title, setTitle] = useState("Skills Assessment");
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [chartColor, setChartColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [dataPoints, setDataPoints] = useState<RadarDataPoint[]>([
    { label: "React", value: 90 },
    { label: "TypeScript", value: 85 },
    { label: "Node.js", value: 80 },
    { label: "Design", value: 75 },
    { label: "DevOps", value: 70 },
  ]);
  const [titleFontSize, setTitleFontSize] = useState(32);
  const [labelFontSize, setLabelFontSize] = useState(14);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showRadiusAxis, setShowRadiusAxis] = useState(true);
  const [chartOpacity, setChartOpacity] = useState(0.6);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [titleFontFamily, setTitleFontFamily] = useState("system-ui");
  const [labelFontFamily, setLabelFontFamily] = useState("system-ui");

  const [gridColorHex, setGridColorHex] = useState("#ffffff");
  const [debouncedGridOpacity, setDebouncedGridOpacity] = useState(0.2);
  const [axisColorHex, setAxisColorHex] = useState("#ffffff");
  const [debouncedAxisOpacity, setDebouncedAxisOpacity] = useState(0.7);

  const gridOpacityTimeoutRef = useRef<NodeJS.Timeout>();
  const axisOpacityTimeoutRef = useRef<NodeJS.Timeout>();

  const hexToRgba = useCallback((hex: string, opacity: number): string => {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }, []);

  const gridColor = hexToRgba(gridColorHex, debouncedGridOpacity);
  const axisColor = hexToRgba(axisColorHex, debouncedAxisOpacity);

  const handleDataPointChange = (
    index: number,
    field: "label" | "value",
    value: string | number
  ) => {
    const newPoints = [...dataPoints];
    if (field === "label") {
      newPoints[index].label = value as string;
    } else {
      newPoints[index].value = Math.min(100, Math.max(0, Number(value)));
    }
    setDataPoints(newPoints);
  };

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { label: "New", value: 50 }]);
  };

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const generateShareUrl = () => {
    const config: ChartConfig = {
      title,
      backgroundColor,
      chartColor,
      textColor,
      gridColor,
      axisColor,
      dataPoints,
      titleFontSize,
      labelFontSize,
      showGrid,
      showAxis,
      chartOpacity,
      strokeWidth,
      showRadiusAxis,
      titleFontFamily,
      labelFontFamily,
    };
    const encoded = btoa(JSON.stringify(config));
    const url = `${window.location.origin}/chart?config=${encoded}`;
    setShareUrl(url);
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGridOpacityChange = (newValue: number) => {
    if (gridOpacityTimeoutRef.current) {
      clearTimeout(gridOpacityTimeoutRef.current);
    }
    gridOpacityTimeoutRef.current = setTimeout(() => {
      setDebouncedGridOpacity(newValue);
    }, 100);
  };

  const handleAxisOpacityChange = (newValue: number) => {
    if (axisOpacityTimeoutRef.current) {
      clearTimeout(axisOpacityTimeoutRef.current);
    }
    axisOpacityTimeoutRef.current = setTimeout(() => {
      setDebouncedAxisOpacity(newValue);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (gridOpacityTimeoutRef.current)
        clearTimeout(gridOpacityTimeoutRef.current);
      if (axisOpacityTimeoutRef.current)
        clearTimeout(axisOpacityTimeoutRef.current);
    };
  }, []);

  const fontFamilyOptions = [
    { value: "system-ui", label: "System UI" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "cursive", label: "Cursive" },
    { value: "fantasy", label: "Fantasy" },
    { value: "Georgia", label: "Georgia" },
    { value: "Courier New", label: "Courier New" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Arial", label: "Arial" },
    { value: "Verdana", label: "Verdana" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 shrink-0">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">
          Radar Chart Builder
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Create and customize highly embeddable radar charts
        </p>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-hidden px-4 md:p-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 h-full">
          {/* Configuration Form - Left Column */}
          <div className="overflow-y-auto pr-2 md:pr-4 min-h-0">
            <Card className="bg-card border-border">
              <CardHeader className="sticky top-0 bg-card z-10 border-b border-border py-3 md:py-4">
                <CardTitle className="text-base md:text-lg">
                  Chart Configuration
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Customize your radar chart settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">
                    Chart Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="titleFontSize" className="text-foreground">
                      Title Font Size
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {titleFontSize}px
                    </span>
                  </div>
                  <input
                    id="titleFontSize"
                    type="range"
                    min="16"
                    max="64"
                    value={titleFontSize}
                    onChange={(e) => setTitleFontSize(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label htmlFor="bgColor" className="text-foreground">
                    Background Color
                  </Label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="bgColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 bg-input border-border text-foreground text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor" className="text-foreground">
                    Text Color
                  </Label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 bg-input border-border text-foreground text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                {/* Chart Color */}
                <div className="space-y-2">
                  <Label htmlFor="chartColor" className="text-foreground">
                    Chart Color
                  </Label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="chartColor"
                      type="color"
                      value={chartColor}
                      onChange={(e) => setChartColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={chartColor}
                      onChange={(e) => setChartColor(e.target.value)}
                      className="flex-1 bg-input border-border text-foreground text-sm"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chartOpacity" className="text-foreground">
                      Chart Fill Opacity
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {(chartOpacity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    id="chartOpacity"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={chartOpacity * 100}
                    onChange={(e) =>
                      setChartOpacity(Number(e.target.value) / 100)
                    }
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="strokeWidth" className="text-foreground">
                      Chart Stroke Width
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {strokeWidth}px
                    </span>
                  </div>
                  <input
                    id="strokeWidth"
                    type="range"
                    min="1"
                    max="5"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="showGrid"
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="cursor-pointer w-4 h-4"
                    />
                    <Label
                      htmlFor="showGrid"
                      className="text-foreground cursor-pointer"
                    >
                      Show Grid
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="showAxis"
                      type="checkbox"
                      checked={showAxis}
                      onChange={(e) => setShowAxis(e.target.checked)}
                      className="cursor-pointer w-4 h-4"
                    />
                    <Label
                      htmlFor="showAxis"
                      className="text-foreground cursor-pointer"
                    >
                      Show Axis Labels
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="showRadiusAxis"
                      type="checkbox"
                      checked={showRadiusAxis}
                      onChange={(e) => setShowRadiusAxis(e.target.checked)}
                      className="cursor-pointer w-4 h-4"
                    />
                    <Label
                      htmlFor="showRadiusAxis"
                      className="text-foreground cursor-pointer"
                    >
                      Show Radius Axis (0-100 Numbers)
                    </Label>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <Label className="text-foreground font-semibold">
                    Advanced Colors
                  </Label>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gridColor"
                      className="text-sm text-muted-foreground"
                    >
                      Grid Color
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-3 items-center">
                        <input
                          id="gridColor"
                          type="color"
                          value={gridColorHex}
                          onChange={(e) => setGridColorHex(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={gridColorHex}
                          onChange={(e) => setGridColorHex(e.target.value)}
                          className="flex-1 bg-input border-border text-foreground text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="gridOpacity"
                          className="text-xs text-muted-foreground"
                        >
                          Opacity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {(debouncedGridOpacity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        id="gridOpacity"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={debouncedGridOpacity * 100}
                        onChange={(e) =>
                          handleGridOpacityChange(Number(e.target.value) / 100)
                        }
                        className="w-full cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="axisColor"
                      className="text-sm text-muted-foreground"
                    >
                      Axis Color
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-3 items-center">
                        <input
                          id="axisColor"
                          type="color"
                          value={axisColorHex}
                          onChange={(e) => setAxisColorHex(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={axisColorHex}
                          onChange={(e) => setAxisColorHex(e.target.value)}
                          className="flex-1 bg-input border-border text-foreground text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="axisOpacity"
                          className="text-xs text-muted-foreground"
                        >
                          Opacity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {(debouncedAxisOpacity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        id="axisOpacity"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={debouncedAxisOpacity * 100}
                        onChange={(e) =>
                          handleAxisOpacityChange(Number(e.target.value) / 100)
                        }
                        className="w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleFontFamily" className="text-foreground">
                    Title Font Family
                  </Label>
                  <select
                    id="titleFontFamily"
                    value={titleFontFamily}
                    onChange={(e) => setTitleFontFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
                  >
                    {fontFamilyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="labelFontSize" className="text-foreground">
                      Label Font Size
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {labelFontSize}px
                    </span>
                  </div>
                  <input
                    id="labelFontSize"
                    type="range"
                    min="10"
                    max="24"
                    value={labelFontSize}
                    onChange={(e) => setLabelFontSize(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labelFontFamily" className="text-foreground">
                    Label Font Family
                  </Label>
                  <select
                    id="labelFontFamily"
                    value={labelFontFamily}
                    onChange={(e) => setLabelFontFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
                  >
                    {fontFamilyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Points */}
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-foreground">Data Points</Label>
                    <Button
                      onClick={addDataPoint}
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      Add Point
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {dataPoints.map((point, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Label
                          </Label>
                          <Input
                            value={point.label}
                            onChange={(e) =>
                              handleDataPointChange(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                            className="bg-input border-border text-foreground text-sm"
                            placeholder="e.g., React"
                          />
                        </div>
                        <div className="w-24 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Value
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={point.value}
                            onChange={(e) =>
                              handleDataPointChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            className="bg-input border-border text-foreground text-sm"
                          />
                        </div>
                        <Button
                          onClick={() => removeDataPoint(index)}
                          variant="ghost"
                          size="sm"
                          disabled={dataPoints.length <= 2}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateShareUrl}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  Generate Share Link
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview - Right Column */}
          <div className="flex flex-col gap-4 md:gap-6 min-h-0">
            {/* Preview Card - 60% height */}
            <div className="flex-1 basis-3/5 min-h-0 flex flex-col">
              <Card className="bg-card border-border h-full flex flex-col">
                <CardHeader className="shrink-0 border-b border-border py-3 md:py-4">
                  <CardTitle className="text-base md:text-lg">
                    Preview
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Real-time chart preview
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden min-h-0 p-2 md:p-4">
                  <div className="h-full w-full flex items-center justify-center">
                    <RadarChartPreview
                      title={title}
                      dataPoints={dataPoints}
                      backgroundColor={backgroundColor}
                      chartColor={chartColor}
                      textColor={textColor}
                      gridColor={gridColor}
                      axisColor={axisColor}
                      titleFontSize={titleFontSize}
                      labelFontSize={labelFontSize}
                      showGrid={showGrid}
                      showAxis={showAxis}
                      chartOpacity={chartOpacity}
                      strokeWidth={strokeWidth}
                      showRadiusAxis={showRadiusAxis}
                      titleFontFamily={titleFontFamily}
                      labelFontFamily={labelFontFamily}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Embed Link Card - 40% height */}
            {shareUrl && (
              <div className="flex-1 basis-2/5 min-h-0 flex flex-col">
                <Card className="bg-card border-border h-full flex flex-col">
                  <CardHeader className="shrink-0 border-b border-border py-3 md:py-4">
                    <CardTitle className="text-base md:text-lg">
                      Your Embed Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto min-h-0 space-y-3 md:space-y-4 pt-4 md:pt-6 p-3 md:p-6">
                    <div className="space-y-2">
                      <Label className="text-foreground text-xs md:text-sm">
                        Share this link to embed the chart:
                      </Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          readOnly
                          value={shareUrl}
                          className="bg-input border-border text-foreground text-xs"
                        />
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="sm"
                          className="border-border hover:bg-accent bg-transparent shrink-0"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This link contains your chart configuration and can be
                      shared or embedded anywhere.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
