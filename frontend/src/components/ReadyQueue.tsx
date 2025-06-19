import React from 'react';

interface ReadyQueueEntry {
  time: number;
  queue: string[];
}

interface ReadyQueueHistoryProps {
  history: ReadyQueueEntry[];
}

const ReadyQueueHistory: React.FC<ReadyQueueHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic">
        No ready queue history available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Ready Queue Timeline</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 uppercase tracking-wider">
              <th className="px-4 py-2 border-b">Time</th>
              <th className="px-4 py-2 border-b">Ready Queue</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.time} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border-b font-medium">{entry.time}</td>
                <td className="px-4 py-2 border-b">
                  {entry.queue.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.queue.map((pid) => (
                        <span
                          key={pid}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                        >
                          {pid}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Idle</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadyQueueHistory;
