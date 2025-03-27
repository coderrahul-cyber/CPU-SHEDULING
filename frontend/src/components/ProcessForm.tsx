import { useState, FormEvent } from 'react';

interface ProcessFormData {
  id: string;
  arrival_time: number;
  burst_time: number;
  priority: number;
}

interface ProcessFormProps {
  onAddProcess: (process: ProcessFormData) => void;
}

export default function ProcessForm({ onAddProcess }: ProcessFormProps) {
  const [process, setProcess] = useState<ProcessFormData>({
    id: '',
    arrival_time: 0,
    burst_time: 1,
    priority: 0
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (process.id.trim() && process.burst_time >= 1) {
      onAddProcess({ ...process });
      setProcess({
        id: '',
        arrival_time: 0,
        burst_time: 1,
        priority: 0
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-4 md:w-[25vw]">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Process</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Process ID
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={process.id}
              onChange={(e) => setProcess(p => ({ ...p, id: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Arrival Time
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.arrival_time}
              onChange={(e) => setProcess(p => ({ ...p, arrival_time: +e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Burst Time
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.burst_time}
              onChange={(e) => setProcess(p => ({ ...p, burst_time: +e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Priority
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.priority}
              onChange={(e) => setProcess(p => ({ ...p, priority: +e.target.value }))}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={!process.id.trim() || process.burst_time < 1}
        >
          Add Process
        </button>
      </form>
    </div>
  );
}