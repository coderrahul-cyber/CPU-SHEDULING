interface SimulationControlsProps {
    onSimulate: () => Promise<void>;
    onReset: () => void;
    isSimulating: boolean;
    hasProcesses: boolean;
  }
  
  // SimulationControls.tsx
  export default function SimulationControls({
    onSimulate,
    onReset,
    isSimulating,
    hasProcesses
  }: SimulationControlsProps) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md md:w-[25vw] ">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Simulate Button */}
          <button
            onClick={onSimulate}
            disabled={!hasProcesses || isSimulating}
            className={`px-6 py-3 rounded-md font-medium transition-colors
              ${!hasProcesses || isSimulating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Simulating...
              </span>
            ) : 'Start Simulation'}
          </button>
  
          {/* Reset Button */}
          <button
            onClick={onReset}
            className="px-6 py-3 border border-red-600 text-red-600
                     rounded-md hover:bg-red-50 transition-colors"
          >
            Reset Simulation
          </button>
        </div>
      </div>
    );
  }