import React from 'react';

interface TimelineEntry {
  id: string;
  start: number;
  end: number;
  label?: string; // Optional custom label
}

interface GanttChartProps {
  timeline: TimelineEntry[];
  /** px per time unit */
  unitWidth?: number;
  /** Chart title */
  title?: string;
  /** Height of each bar in pixels */
  barHeight?: number;
}

const COLORS = [
  'bg-blue-500', 
  'bg-green-500', 
  'bg-purple-500', 
  'bg-orange-500', 
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500'
];

export default function GanttChart({
  timeline,
  unitWidth = 60,
  title = "Execution Timeline",
  barHeight = 32,
}: GanttChartProps) {
  // Input validation
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  // Validate timeline entries
  const validEntries = timeline.filter(entry => {
    if (entry.start < 0 || entry.end < 0 || entry.start >= entry.end) {
      console.warn(`Invalid timeline entry: ${entry.id}`, entry);
      return false;
    }
    return true;
  });

  if (validEntries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-500">No valid timeline entries found</p>
      </div>
    );
  }

  const sorted = [...validEntries].sort((a, b) => a.start - b.start);
  const maxEnd = Math.max(...sorted.map((e) => e.end));
  const minStart = Math.min(...sorted.map((e) => e.start));
  const totalTime = maxEnd - minStart;

  const getColor = (id: string) => {
    const hash = Array.from(id).reduce((sum, c) => sum + c.charCodeAt(0), 0);
    return COLORS[hash % COLORS.length];
  };

  // width of the chart area in px
  const chartWidth = Math.max(totalTime * unitWidth, 200); // Minimum width
  const chartHeight = Math.max(sorted.length * (barHeight + 8), 40); // Dynamic height based on entries

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      
      {/* Chart container */}
      <div className="relative" style={{ minWidth: chartWidth }}>
        {/* Background grid lines */}
        <div className="absolute inset-0 flex pointer-events-none opacity-30">
          {Array.from({ length: Math.ceil(totalTime) + 1 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-gray-300"
              style={{ 
                position: 'absolute',
                left: i * unitWidth,
                height: '100%',
                width: '1px'
              }}
            />
          ))}
        </div>

        {/* Bars container */}
        <div
          role="list"
          className="relative"
          style={{ 
            width: chartWidth,
            height: chartHeight,
            minHeight: '80px'
          }}
        >
          {sorted.map((entry, index) => {
            const duration = entry.end - entry.start;
            const leftPosition = (entry.start - minStart) * unitWidth;
            const width = duration * unitWidth;
            const topPosition = index * (barHeight + 8) + 8;

            // Ensure minimum width for very short durations
            const minBarWidth = 30;
            const actualWidth = Math.max(width, minBarWidth);

            return (
              <div
                key={entry.id}
                role="listitem"
                className={`
                  absolute flex flex-col items-center justify-center min-h-max
                  ${getColor(entry.id)} rounded-lg border-2 border-white
                  shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md
                  cursor-pointer
                `}
                style={{
                  left: leftPosition,
                  top: topPosition,
                  width: actualWidth,
                  height: barHeight,
                }}
                title={`${entry.label || `Process ${entry.id}`}: ${entry.start}–${entry.end} (Duration: ${duration})`}
              >
                <span className="text-white font-semibold text-sm truncate px-1">
                  {entry.label || `P${entry.id}`}
                </span>
                <span className="text-xs text-white/90">
                  {duration > 2 ? `${entry.start}–${entry.end}` : duration.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time axis */}
        <div 
          className="relative mt-2 border-t border-gray-300" 
          style={{ width: chartWidth, height: '24px' }}
        >
          {Array.from({ length: Math.ceil(totalTime) + 1 }).map((_, i) => {
            const timeValue = minStart + i;
            return (
              <div
                key={i}
                className="absolute top-1 text-xs text-gray-600 font-medium"
                style={{
                  left: i * unitWidth,
                  transform: 'translateX(-50%)',
                }}
              >
                {timeValue}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend/Summary */}
      {sorted.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Summary:</span> {sorted.length} processes, 
          Total time span: {minStart}–{maxEnd} ({totalTime} units)
        </div>
      )}
    </div>
  );
}