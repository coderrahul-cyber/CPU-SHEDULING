import { Dispatch, SetStateAction } from 'react';
import { SchedulingAlgorithm } from '../types/alogrithmTypes';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  onAlgorithmChange: Dispatch<SetStateAction<SchedulingAlgorithm>>;
  timeQuantum: number;
  onTimeQuantumChange: (value: number) => void;
}

const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
}: AlgorithmSelectorProps) => {
  // Define available algorithms with user-friendly names
  const algorithms = [
    { value: 'FCFS', label: 'First-Come First-Served (FCFS)' },
    { value: 'SJF', label: 'Shortest Job First (SJF)' },
    { value: 'Priority', label: 'Priority Scheduling' },
    { value: 'RR', label: 'Round Robin (RR)' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-4 md:w-[25vw]">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Scheduling Algorithm
      </h2>

      {/* Algorithm Selection Dropdown */}
      <div className="space-y-4">
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as SchedulingAlgorithm)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {algorithms.map((algorithm) => (
            <option
              key={algorithm.value}
              value={algorithm.value}
              className="p-2 hover:bg-blue-50"
            >
              {algorithm.label}
            </option>
          ))}
        </select>

        {/* Time Quantum Input (Conditional) */}
        {selectedAlgorithm === 'RR' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Time Quantum (for Round Robin)
            </label>
            <input
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(Math.max(1, +e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter time quantum"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmSelector;