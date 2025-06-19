// // services/api.ts
// import axios from 'axios';

// // Type definitions
// export interface ProcessRequest {
//   id: string;
//   arrival_time: number;
//   burst_time: number;
//   priority: number;
// }

// export interface TimelineEntry {
//   id: string;
//   start: number;
//   end: number;
// }

// interface MetricsResponse {
//   avgWaitingTime: number;
//   avgTurnaroundTime: number;
//   waitingTimes: Record<string, number>;
//   turnaroundTimes: Record<string, number>;
// }

// export interface ApiResponse {
//   timeline: TimelineEntry[];
//   metrics: MetricsResponse;
// }

// export interface ApiError {
//   message: string;
//   details?: unknown;
// }

// export interface ProcessMetrics extends ProcessRequest {
//   waitingTime: number;
//   turnaroundTime: number;
// }
// const api = axios.create({
//   baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// export const scheduleProcesses = async (
//   processes: ProcessRequest[],
//   algorithm: string,
//   timeQuantum: number
// ): Promise<ApiResponse> => {
//   try {
//     const response = await api.post<ApiResponse>('/schedule', {
//       processes,
//       algorithm,
//       time_quantum: timeQuantum,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw {
//         message: error.response?.data?.error || 'Unknown API error',
//         details: error.response?.data,
//       } as ApiError;
//     }
//     throw {
//       message: 'Network error occurred',
//       details: error,
//     } as ApiError;
//   }
// };

// // Helper function to transform metrics
// export const transformMetrics = (
//   processes: ProcessRequest[],
//   metrics: MetricsResponse
// ): ProcessMetrics[] => {
//   console.log("Raw Metrics:", metrics);
//   console.log("Processes:", processes);
//   return processes.map((process) => {
//     const waitingTime = metrics.waitingTimes?.[process.id] ?? 0;
//     const turnaroundTime = metrics.turnaroundTimes?.[process.id] ?? 0;

//     return {
//       ...process,
//       waitingTime,
//       turnaroundTime
//     };
//   });
// };

import axios from 'axios';

// Type definitions
export interface ProcessRequest {
  id: string;
  arrival_time: number;
  burst_time: number;
  priority: number;
}

export interface TimelineEntry {
  id: string;
  start: number;
  end: number;
}

export interface MetricsResponse {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  waitingTimes: Record<string, number>;
  turnaroundTimes: Record<string, number>;
}

export interface ReadyQueueEntry {
  time: number;
  queue: string[]; // process IDs in ready queue at that time
}

export interface ApiResponse {
  timeline: TimelineEntry[];
  metrics: MetricsResponse;
  ready_queue_history?: ReadyQueueEntry[]; // <-- Optional support added
}

export interface ApiError {
  message: string;
  details?: unknown;
}

export interface ProcessMetrics extends ProcessRequest {
  waitingTime: number;
  turnaroundTime: number;
}

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Main API call
export const scheduleProcesses = async (
  processes: ProcessRequest[],
  algorithm: string,
  timeQuantum: number
): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/schedule', {
      processes,
      algorithm,
      time_quantum: timeQuantum,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.error || 'Unknown API error',
        details: error.response?.data,
      } as ApiError;
    }
    throw {
      message: 'Network error occurred',
      details: error,
    } as ApiError;
  }
};

// Helper function to transform metrics
export const transformMetrics = (
  processes: ProcessRequest[],
  metrics: MetricsResponse
): ProcessMetrics[] => {
  return processes.map((process) => {
    const waitingTime = metrics.waitingTimes?.[process.id] ?? 0;
    const turnaroundTime = metrics.turnaroundTimes?.[process.id] ?? 0;

    return {
      ...process,
      waitingTime,
      turnaroundTime,
  
    };
  });
};

