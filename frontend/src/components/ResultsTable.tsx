// types.ts
export interface ProcessMetrics {
    id: string;
    arrival_time: number;
    burst_time: number;
    waitingTime: number;
    turnaroundTime: number;
  }
  
interface ResultsTableProps {
  processes?: ProcessMetrics[];
  metrics?: {
    avgWaitingTime?: number;
    avgTurnaroundTime?: number;
  };
}

function ResultsTable({ processes=[] , metrics ={}}: ResultsTableProps) {
  console.log(metrics.avgTurnaroundTime , "average")
  // Add safe defaults
  const safeMetrics = {
    avgWaitingTime: metrics?.avgWaitingTime || 0,
    avgTurnaroundTime: metrics?.avgTurnaroundTime || 0
  };

  return (
    <div className="results-table  bg-white p-6 rounded-xl ">
      <h3 className="text-xl font-semibold mb-2 ">Performance Metrics</h3>
      
      <table>
        <thead>
          <tr  >
            <th className="px-2">Process</th>
            <th className="px-2">Arrival Time</th>
            <th className="px-2">Burst Time</th>
            <th className="px-2">Waiting Time</th>
            <th>Turnaround Time</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {processes?.map((process) => (
            <tr key={process.id} >
              <td>P{process.id}</td>
              <td>{process.arrival_time}</td>
              <td>{process.burst_time}</td>
              <td>{process.waitingTime}</td>
              <td>{process.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2">
        <p className=" font-semibold">Average Waiting Time: <span className="text-sm text-gray-600 ">{safeMetrics.avgWaitingTime.toFixed(2)}</span></p>
        <p className=" font-semibold">Average Turnaround Time: <span className="text-sm text-gray-600 ">{safeMetrics.avgTurnaroundTime.toFixed(2)}</span> </p>
      </div>
    </div>
  );
}

export default ResultsTable;