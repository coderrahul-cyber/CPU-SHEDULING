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
    <div className="p-6 h-max w-full bg-white rounded-xl shadow-lg mb-4 md:w-[25vw]">
      <h2 className="text-2xl font-mono   text-gray-900 text-center">Add Process</h2>
      <hr className='w-full border-none mx-2 bg-black/60 h-[0.5px] '/>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center  mb-4">
          <div>
            <label className="block tracking-tight font-mono text-gray-800 mb-1">
              Process ID
            </label>
            <input
              type="text"
              className=" w-full p-2  border-[1px] rounded-md focus:ring-1 focus:ring-gray-500  "
              value={process.id}
              onChange={(e) => setProcess(p => ({ ...p, id: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block tracking-tight font-mono text-gray-800 mb-1">
              Arrival Time
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border-[1px] rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.arrival_time}
              onChange={(e) => setProcess(p => ({ ...p, arrival_time: +e.target.value }))}
            />
          </div>

          <div>
            <label className="block tracking-tight font-mono text-gray-800 mb-1">
              Burst Time
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border-[1px] rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.burst_time}
              onChange={(e) => setProcess(p => ({ ...p, burst_time: +e.target.value }))}
            />
          </div>

          <div>
            <label className="block tracking-tight font-mono text-gray-800 mb-1">
              Priority
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border-[1px] rounded-md focus:ring-2 focus:ring-blue-500"
              value={process.priority}
              onChange={(e) => setProcess(p => ({ ...p, priority: +e.target.value }))}
            />
          </div>
        </div>

         <div className="flex w-full ">
        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 text-white     bg-blue-500  rounded-md  font-medium     cursor-pointer mx-auto"
          disabled={!process.id.trim() || process.burst_time < 1}
        >
          Add Process
        </button>

         </div>
      </form>
    </div>
  );
}