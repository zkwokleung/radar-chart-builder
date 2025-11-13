'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import RadarChartPreview from '@/components/radar-chart-preview';

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
  chartOpacity: number;
  strokeWidth: number;
  showRadiusAxis: boolean;
  titleFontFamily: string;
  labelFontFamily: string;
}

export default function ConfigPage() {
  const [title, setTitle] = useState('Stats');
  const [backgroundColor, setBackgroundColor] = useState('#1b1d24');
  const [chartColor, setChartColor] = useState('#d97706');
  const [textColor, setTextColor] = useState('#fef3c7');
  const [dataPoints, setDataPoints] = useState<RadarDataPoint[]>([
    { label: 'Strength', value: 80 },
    { label: 'Dexterity', value: 70 },
    { label: 'Constitution', value: 75 },
    { label: 'Intelligence', value: 60 },
    { label: 'Wisdom', value: 65 },
    { label: 'Charisma', value: 85 },
  ]);
  const [titleFontSize, setTitleFontSize] = useState(32);
  const [labelFontSize, setLabelFontSize] = useState(14);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showRadiusAxis, setShowRadiusAxis] = useState(true);
  const [chartOpacity, setChartOpacity] = useState(0.6);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [copied, setCopied] = useState(false);
  const [titleFontFamily, setTitleFontFamily] = useState('system-ui');
  const [labelFontFamily, setLabelFontFamily] = useState('system-ui');

  const [gridColorHex, setGridColorHex] = useState('#fcd34d');
  const [debouncedGridOpacity, setDebouncedGridOpacity] = useState(0.2);
  const [axisColorHex, setAxisColorHex] = useState('#f97316');
  const [debouncedAxisOpacity, setDebouncedAxisOpacity] = useState(0.7);

  const gridOpacityTimeoutRef = useRef<NodeJS.Timeout>(null);
  const axisOpacityTimeoutRef = useRef<NodeJS.Timeout>(null);

  const hexToRgba = useCallback((hex: string, opacity: number): string => {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }, []);

  const gridColor = hexToRgba(gridColorHex, debouncedGridOpacity);
  const axisColor = hexToRgba(axisColorHex, debouncedAxisOpacity);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
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
    }),
    [
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
    ],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const encoded = btoa(JSON.stringify(chartConfig));
    return `${window.location.origin}/chart?config=${encoded}`;
  }, [chartConfig]);

  const handleDataPointChange = (
    index: number,
    field: 'label' | 'value',
    value: string | number,
  ) => {
    const newPoints = [...dataPoints];
    if (field === 'label') {
      newPoints[index].label = value as string;
    } else {
      newPoints[index].value = Math.min(100, Math.max(0, Number(value)));
    }
    setDataPoints(newPoints);
  };

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { label: 'New', value: 50 }]);
  };

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
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
    { value: 'system-ui', label: 'System UI' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
  ];

  return (
    <div className='bg-background flex min-h-screen w-full flex-col overflow-x-hidden lg:h-screen lg:overflow-hidden'>
      {/* Header */}
      <div className='shrink-0 px-4 pt-4 md:px-8 md:pt-6'>
        <h1 className='text-foreground mb-1 text-2xl font-bold md:text-4xl'>
          Radar Chart Builder
        </h1>
        <p className='text-muted-foreground text-xs md:text-sm'>
          Create and customize highly embeddable radar charts
        </p>
      </div>

      {/* Main Grid */}
      <div className='w-full flex-1 px-4 py-4 md:p-8 lg:overflow-hidden'>
        <div className='grid grid-cols-1 gap-4 md:gap-8 lg:h-full lg:grid-cols-2 lg:overflow-hidden'>
          {/* Configuration Form - Left Column */}
          <div className='min-h-0 pr-2 md:pr-4'>
            <Card className='bg-card border-border flex h-full flex-col'>
              <CardHeader className='border-border shrink-0 border-b'>
                <CardTitle className='text-base md:text-lg'>
                  Chart Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1 space-y-4 pt-4 md:space-y-6 md:pt-6 lg:overflow-y-auto'>
                <div className='space-y-8'>
                  <section className='space-y-4'>
                    <div>
                      <p className='text-foreground text-sm font-semibold'>
                        Chart Basics
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Title and typography for the chart header.
                      </p>
                    </div>
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='title' className='text-foreground'>
                          Chart Title
                        </Label>
                        <Input
                          id='title'
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className='bg-input border-border text-foreground'
                          placeholder='Enter chart title'
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='titleFontSize'
                            className='text-foreground'
                          >
                            Title Font Size
                          </Label>
                          <span className='text-muted-foreground text-sm'>
                            {titleFontSize}px
                          </span>
                        </div>
                        <input
                          id='titleFontSize'
                          type='range'
                          min='16'
                          max='64'
                          value={titleFontSize}
                          onChange={(e) =>
                            setTitleFontSize(Number(e.target.value))
                          }
                          className='w-full cursor-pointer'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='titleFontFamily'
                          className='text-foreground'
                        >
                          Title Font Family
                        </Label>
                        <select
                          id='titleFontFamily'
                          value={titleFontFamily}
                          onChange={(e) => setTitleFontFamily(e.target.value)}
                          className='border-border bg-input text-foreground w-full rounded border px-3 py-2'
                        >
                          {fontFamilyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className='space-y-4'>
                    <div>
                      <p className='text-foreground text-sm font-semibold'>
                        Colors &amp; Styling
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Control the background, text, and radar appearance.
                      </p>
                    </div>
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='bgColor' className='text-foreground'>
                          Background Color
                        </Label>
                        <div className='flex items-center gap-3'>
                          <input
                            id='bgColor'
                            type='color'
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className='border-border h-10 w-12 cursor-pointer rounded border'
                          />
                          <Input
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className='bg-input border-border text-foreground flex-1 text-sm'
                            placeholder='#000000'
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='textColor' className='text-foreground'>
                          Text Color
                        </Label>
                        <div className='flex items-center gap-3'>
                          <input
                            id='textColor'
                            type='color'
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className='border-border h-10 w-12 cursor-pointer rounded border'
                          />
                          <Input
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className='bg-input border-border text-foreground flex-1 text-sm'
                            placeholder='#ffffff'
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='chartColor' className='text-foreground'>
                          Radar Stroke &amp; Fill Color
                        </Label>
                        <div className='flex items-center gap-3'>
                          <input
                            id='chartColor'
                            type='color'
                            value={chartColor}
                            onChange={(e) => setChartColor(e.target.value)}
                            className='border-border h-10 w-12 cursor-pointer rounded border'
                          />
                          <Input
                            value={chartColor}
                            onChange={(e) => setChartColor(e.target.value)}
                            className='bg-input border-border text-foreground flex-1 text-sm'
                            placeholder='#3b82f6'
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='chartOpacity'
                            className='text-foreground'
                          >
                            Radar Fill Opacity (0-100%)
                          </Label>
                          <span className='text-muted-foreground text-sm'>
                            {(chartOpacity * 100).toFixed(0)}%
                          </span>
                        </div>
                        <input
                          id='chartOpacity'
                          type='range'
                          min='0'
                          max='100'
                          step='5'
                          value={chartOpacity * 100}
                          onChange={(e) =>
                            setChartOpacity(Number(e.target.value) / 100)
                          }
                          className='w-full cursor-pointer'
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='strokeWidth'
                            className='text-foreground'
                          >
                            Radar Stroke Width (px)
                          </Label>
                          <span className='text-muted-foreground text-sm'>
                            {strokeWidth}px
                          </span>
                        </div>
                        <input
                          id='strokeWidth'
                          type='range'
                          min='1'
                          max='5'
                          value={strokeWidth}
                          onChange={(e) =>
                            setStrokeWidth(Number(e.target.value))
                          }
                          className='w-full cursor-pointer'
                        />
                      </div>
                    </div>
                  </section>

                  <section className='space-y-4'>
                    <div>
                      <p className='text-foreground text-sm font-semibold'>
                        Axes &amp; Grid
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Choose which guides appear and how they look.
                      </p>
                    </div>
                    <div className='space-y-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <input
                            id='showGrid'
                            type='checkbox'
                            checked={showGrid}
                            onChange={(e) => setShowGrid(e.target.checked)}
                            className='h-4 w-4 cursor-pointer'
                          />
                          <Label
                            htmlFor='showGrid'
                            className='text-foreground cursor-pointer'
                          >
                            Show Grid Circles
                          </Label>
                        </div>
                        <div className='flex items-center gap-3'>
                          <input
                            id='showAxis'
                            type='checkbox'
                            checked={showAxis}
                            onChange={(e) => setShowAxis(e.target.checked)}
                            className='h-4 w-4 cursor-pointer'
                          />
                          <Label
                            htmlFor='showAxis'
                            className='text-foreground cursor-pointer'
                          >
                            Show Spoke Labels
                          </Label>
                        </div>
                        <div className='flex items-center gap-3'>
                          <input
                            id='showRadiusAxis'
                            type='checkbox'
                            checked={showRadiusAxis}
                            onChange={(e) =>
                              setShowRadiusAxis(e.target.checked)
                            }
                            className='h-4 w-4 cursor-pointer'
                          />
                          <Label
                            htmlFor='showRadiusAxis'
                            className='text-foreground cursor-pointer'
                          >
                            Show Radial Scale Numbers (0-100)
                          </Label>
                        </div>
                      </div>
                      <div className='border-border space-y-4 rounded-md border p-3'>
                        <div>
                          <p className='text-foreground text-xs font-semibold tracking-wide uppercase'>
                            Stroke Colors
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Fine-tune the grid and label outlines.
                          </p>
                        </div>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='gridColor'
                            className='text-muted-foreground text-sm'
                          >
                            Grid Stroke Color (hex)
                          </Label>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-3'>
                              <input
                                id='gridColor'
                                type='color'
                                value={gridColorHex}
                                onChange={(e) =>
                                  setGridColorHex(e.target.value)
                                }
                                className='border-border h-10 w-12 cursor-pointer rounded border'
                              />
                              <Input
                                value={gridColorHex}
                                onChange={(e) =>
                                  setGridColorHex(e.target.value)
                                }
                                className='bg-input border-border text-foreground flex-1 text-sm'
                                placeholder='#ffffff'
                              />
                            </div>
                            <div className='flex items-center justify-between'>
                              <Label
                                htmlFor='gridOpacity'
                                className='text-muted-foreground text-xs'
                              >
                                Grid Stroke Opacity
                              </Label>
                              <span className='text-muted-foreground text-xs'>
                                {(debouncedGridOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <input
                              id='gridOpacity'
                              type='range'
                              min='0'
                              max='100'
                              step='5'
                              value={debouncedGridOpacity * 100}
                              onChange={(e) =>
                                handleGridOpacityChange(
                                  Number(e.target.value) / 100,
                                )
                              }
                              className='w-full cursor-pointer'
                            />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='axisColor'
                            className='text-muted-foreground text-sm'
                          >
                            Axis/Label Stroke Color (hex)
                          </Label>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-3'>
                              <input
                                id='axisColor'
                                type='color'
                                value={axisColorHex}
                                onChange={(e) =>
                                  setAxisColorHex(e.target.value)
                                }
                                className='border-border h-10 w-12 cursor-pointer rounded border'
                              />
                              <Input
                                value={axisColorHex}
                                onChange={(e) =>
                                  setAxisColorHex(e.target.value)
                                }
                                className='bg-input border-border text-foreground flex-1 text-sm'
                                placeholder='#ffffff'
                              />
                            </div>
                            <div className='flex items-center justify-between'>
                              <Label
                                htmlFor='axisOpacity'
                                className='text-muted-foreground text-xs'
                              >
                                Axis/Label Stroke Opacity
                              </Label>
                              <span className='text-muted-foreground text-xs'>
                                {(debouncedAxisOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <input
                              id='axisOpacity'
                              type='range'
                              min='0'
                              max='100'
                              step='5'
                              value={debouncedAxisOpacity * 100}
                              onChange={(e) =>
                                handleAxisOpacityChange(
                                  Number(e.target.value) / 100,
                                )
                              }
                              className='w-full cursor-pointer'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className='space-y-4'>
                    <div>
                      <p className='text-foreground text-sm font-semibold'>
                        Labels &amp; Typography
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Style the axis labels for readability.
                      </p>
                    </div>
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='labelFontSize'
                            className='text-foreground'
                          >
                            Label Font Size
                          </Label>
                          <span className='text-muted-foreground text-sm'>
                            {labelFontSize}px
                          </span>
                        </div>
                        <input
                          id='labelFontSize'
                          type='range'
                          min='10'
                          max='24'
                          value={labelFontSize}
                          onChange={(e) =>
                            setLabelFontSize(Number(e.target.value))
                          }
                          className='w-full cursor-pointer'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='labelFontFamily'
                          className='text-foreground'
                        >
                          Label Font Family
                        </Label>
                        <select
                          id='labelFontFamily'
                          value={labelFontFamily}
                          onChange={(e) => setLabelFontFamily(e.target.value)}
                          className='border-border bg-input text-foreground w-full rounded border px-3 py-2'
                        >
                          {fontFamilyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className='border-border space-y-4 border-t pt-4'>
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <p className='text-foreground text-sm font-semibold'>
                          Data Points
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Update the axes labels and their 0-100 scores.
                        </p>
                      </div>
                      <Button
                        onClick={addDataPoint}
                        variant='outline'
                        size='sm'
                        className='border-border hover:bg-accent hover:text-accent-foreground bg-transparent'
                      >
                        Add Point
                      </Button>
                    </div>
                    <div className='max-h-96 space-y-3 overflow-y-auto'>
                      {dataPoints.map((point, index) => (
                        <div key={index} className='flex items-end gap-2'>
                          <div className='flex-1 space-y-1'>
                            <Label className='text-muted-foreground text-xs'>
                              Axis Label
                            </Label>
                            <Input
                              value={point.label}
                              onChange={(e) =>
                                handleDataPointChange(
                                  index,
                                  'label',
                                  e.target.value,
                                )
                              }
                              className='bg-input border-border text-foreground text-sm'
                              placeholder='e.g., React'
                            />
                          </div>
                          <div className='w-24 space-y-1'>
                            <Label className='text-muted-foreground text-xs'>
                              Score (0-100)
                            </Label>
                            <Input
                              type='number'
                              min='0'
                              max='100'
                              value={point.value}
                              onChange={(e) =>
                                handleDataPointChange(
                                  index,
                                  'value',
                                  e.target.value,
                                )
                              }
                              className='bg-input border-border text-foreground text-sm'
                            />
                          </div>
                          <Button
                            onClick={() => removeDataPoint(index)}
                            variant='ghost'
                            size='sm'
                            disabled={dataPoints.length <= 2}
                            className='text-destructive hover:bg-destructive/10'
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview - Right Column */}
          <div className='flex min-h-0 flex-col gap-4 md:gap-6 lg:overflow-y-auto'>
            {/* Preview Card - 60% height */}
            <div className='flex min-h-0 flex-1 basis-3/5 flex-col'>
              <Card className='bg-card border-border flex h-full flex-col'>
                <CardHeader className='border-border shrink-0 border-b'>
                  <CardTitle className='text-base md:text-lg'>
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className='min-h-0 flex-1 overflow-hidden p-2 md:p-4'>
                  <div className='flex h-full w-full items-center justify-center'>
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
            {/* Embed Link Card */}
            <div className='flex min-h-0 flex-1 basis-1/5 flex-col'>
              <Card className='bg-card border-border flex h-full flex-col'>
                <CardHeader className='border-border shrink-0 border-b'>
                  <CardTitle className='text-base md:text-lg'>
                    Your Embed Link
                  </CardTitle>
                </CardHeader>
                <CardContent className='min-h-0 flex-1 overflow-y-auto'>
                  <div className='space-y-2'>
                    <Label className='text-foreground text-xs md:text-sm'>
                      Share this link to embed the chart:
                    </Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        readOnly
                        value={shareUrl}
                        className='bg-input border-border text-foreground text-xs'
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant='outline'
                        size='sm'
                        className='border-border hover:bg-accent shrink-0 bg-transparent'
                      >
                        {copied ? (
                          <Check className='h-4 w-4' />
                        ) : (
                          <Copy className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    This link contains your chart configuration and can be
                    shared or embedded anywhere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
