// Code to display a Gantt Chart using Tailwind CSS
interface TimelineEntry {
  id: string;
  start: number;
  end: number;
}

interface GanttChartProps {
  timeline: TimelineEntry[];
}

const colors = ['bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

export default function GanttChart({ timeline }: GanttChartProps) {
  // Optionally sort timeline if not guaranteed to be sorted
  const sortedTimeline = [...timeline].sort((a, b) => a.start - b.start);
  const totalTime = sortedTimeline.length > 0 ? sortedTimeline[sortedTimeline.length - 1].end : 0;
  
  const getColorClass = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-max ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Execution Timeline</h2>
      
      <div className="relative bg-gray-50 rounded-md overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex ">
          {Array.from({ length: totalTime + 1 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-gray-200 last:border-r-0" />
          ))}
        </div>
        
        <div className="relative flex items-center h-20">
          {sortedTimeline.map((entry, index) => {
            const duration = entry.end - entry.start;
            const widthPercent = (duration / totalTime) * 100;
            
            return (
              <div
                key={`${entry.id}-${index}`}
                className={`h-full flex items-center justify-center ${getColorClass(entry.id)} 
                  relative border-r border-white  transition-transform duration-300 transform hover:scale-105`}
                style={{ 
                  width: `${widthPercent}%`,
                  minWidth: '60px'
                }}
                title={`P${entry.id}: ${entry.start} - ${entry.end}`}
              >
                <div className="text-center text-white z-10">
                  <p className="text-sm font-semibold">P{entry.id}</p>
                  <p className="text-xs opacity-90">{entry.start} - {entry.end}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
