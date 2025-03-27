import { useState } from 'react';
import { scheduleProcesses, transformMetrics } from './services/api';
import {
  ProcessRequest,
  ApiResponse,
  ApiError,
  ProcessMetrics,
} from './services/api';
import ProcessForm from './components/ProcessForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import ResultsTable from './components/ResultsTable';
import SimulationControls from './components/SimulationControls';

// Type definitions
type Algorithm = 'FCFS' | 'SJF' | 'Priority' | 'RR';

export default function App() {
  // State management
  const [processes, setProcesses] = useState<ProcessRequest[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state (optional, or use inline transform)
  const processMetrics: ProcessMetrics[] = results
    ? transformMetrics(processes, results.metrics)
    : [];

  // Simulation handler
  const handleSimulate = async () => {
    if (processes.length === 0) return;
    
    setIsSimulating(true);
    setError(null);
    
    try {
      const data = await scheduleProcesses(processes, algorithm, timeQuantum);
      console.log("API Response:", data); // Debug log
      setResults(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Simulation failed');
      console.error("Simulation error:", apiError.details);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    setProcesses([]);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="container mx-auto px-4 md:px-0">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Process Scheduling Simulator
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  ">
          {/* Control Section */}
          <div className="lg:col-span-1">
            <ProcessForm
              onAddProcess={(newProcess) => 
                setProcesses([...processes, newProcess])
              }
            />
            
            <AlgorithmSelector
              selectedAlgorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
            />
            
            <SimulationControls
              onSimulate={handleSimulate}
              onReset={handleReset}
              isSimulating={isSimulating}
              hasProcesses={processes.length > 0}
            />
          </div>

          {/* Visualization Section */}
          <div className="lg:col-span-2 space-y-6 lg:ml-40">
            {results && (
              <>
                <GanttChart timeline={results.timeline} />
                <ResultsTable
                  processes={processMetrics}
                  metrics={results.metrics}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
