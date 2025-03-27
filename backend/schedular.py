def calculate_schedule(processes, algorithm, time_quantum=1):
    # Create a copy to avoid modifying original data
    processes = [p.copy() for p in processes]
    
    # Select algorithm implementation
    if algorithm == 'FCFS':
        return fcfs(processes)
    elif algorithm == 'SJF':
        return sjf(processes)
    elif algorithm == 'Priority':
        return priority_scheduling(processes)
    elif algorithm == 'RR':
        return round_robin(processes, time_quantum)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")


def calculate_metrics(processes, timeline):
    # Initialize metrics dictionaries
    waiting_times = {p['id']: 0 for p in processes}
    turnaround_times = {p['id']: 0 for p in processes}
    
    # Calculate finish times
    finish_times = {}
    for entry in timeline:
        finish_times[entry['id']] = entry['end']
    
    # Calculate metrics for each process
    for p in processes:
        turnaround_times[p['id']] = finish_times[p['id']] - p['arrival_time']
        waiting_times[p['id']] = turnaround_times[p['id']] - p['burst_time']
    
    avg_waiting = sum(waiting_times.values()) / len(processes)
    avg_turnaround = sum(turnaround_times.values()) / len(processes)
    
    return {
        'waitingTimes': waiting_times,
        'turnaroundTimes': turnaround_times,
        'avgWaitingTime': round(avg_waiting, 2),    # Updated key
        'avgTurnaroundTime': round(avg_turnaround, 2) # Updated key
      }

# FCFS Implementation
def fcfs(processes):
    timeline = []
    current_time = 0
    
    # Sort by arrival time
    sorted_processes = sorted(processes, key=lambda x: x['arrival_time'])
    
    for p in sorted_processes:
        if current_time < p['arrival_time']:
            current_time = p['arrival_time']
            
        timeline.append({
            'id': p['id'],
            'start': current_time,
            'end': current_time + p['burst_time']
        })
        current_time += p['burst_time']
    
    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline)
    }


# Round Robin Implementation
def round_robin(processes, time_quantum):
    timeline = []
    queue = []
    current_time = 0
    remaining_time = {p['id']: p['burst_time'] for p in processes}
    processes_dict = {p['id']: p for p in processes}
    
    # Sort processes by arrival time
    sorted_processes = sorted(processes, key=lambda x: x['arrival_time'])
    queue = [p['id'] for p in sorted_processes]
    
    while queue:
        pid = queue.pop(0)
        p = processes_dict[pid]
        
        # Handle arrival time
        if current_time < p['arrival_time']:
            current_time = p['arrival_time']
        
        # Calculate execution time
        exec_time = min(remaining_time[pid], time_quantum)
        
        # Add to timeline
        timeline.append({
            'id': pid,
            'start': current_time,
            'end': current_time + exec_time
        })
        
        # Update remaining time
        remaining_time[pid] -= exec_time
        current_time += exec_time
        
        # Add processes that arrived during this execution
        for p in sorted_processes:
            if p['arrival_time'] <= current_time and \
               p['id'] not in queue and \
               remaining_time[p['id']] > 0 and \
               p['id'] != pid:
                queue.append(p['id'])
        
        # Re-add to queue if remaining time > 0
        if remaining_time[pid] > 0:
            queue.append(pid)
    
    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline)
    }


# Similar implementations for SJF and Priority Scheduling...
def sjf(processes):
    timeline = []
    current_time = 0
    remaining = [p.copy() for p in processes]
    
    while remaining:
        # Get available processes
        available = [p for p in remaining if p['arrival_time'] <= current_time]
        if not available:
            # No processes available - advance time
            current_time += 1
            continue
            
        # Select process with shortest burst time
        next_proc = min(available, key=lambda x: x['burst_time'])
        
        timeline.append({
            'id': next_proc['id'],
            'start': current_time,
            'end': current_time + next_proc['burst_time']
        })
        current_time += next_proc['burst_time']
        remaining.remove(next_proc)
    
    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline)
    }


def priority_scheduling(processes):
    """
    Non-preemptive Priority Scheduling implementation.
    Lower priority number indicates higher priority.
    """
    timeline = []
    current_time = 0
    remaining_processes = [p.copy() for p in processes]
    
    while remaining_processes:
        # Get processes that have arrived and are waiting
        arrived_processes = [p for p in remaining_processes if p['arrival_time'] <= current_time]
        
        if not arrived_processes:
            # Jump to next process arrival time if CPU is idle
            next_arrival = min(p['arrival_time'] for p in remaining_processes)
            current_time = next_arrival
            continue
            
        # Select process with highest priority (lowest number)
        # Tiebreakers: 1. Arrival time 2. Process ID
        selected_process = min(
            arrived_processes,
            key=lambda x: (x['priority'], x['arrival_time'], x['id'])
        )
        
        # Add to timeline
        execution = {
            'id': selected_process['id'],
            'start': current_time,
            'end': current_time + selected_process['burst_time']
        }
        timeline.append(execution)
        
        # Update tracking variables
        current_time = execution['end']
        remaining_processes.remove(selected_process)
        
    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline)
    }
