def calculate_schedule(processes, algorithm, time_quantum=1):
    # Create a copy to avoid mutating original data
    processes = [p.copy() for p in processes]

    if algorithm == 'FCFS':
        result = fcfs(processes)
    elif algorithm == 'SJF':
        result = sjf(processes)
    elif algorithm == 'Priority':
        result = priority_scheduling(processes)
    elif algorithm == 'RR':
        result = round_robin(processes, time_quantum)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    # Ensure result always contains timeline and metrics
    response = {
        'timeline': result.get('timeline', []),
        'metrics': result.get('metrics', {})
    }

    # Optionally include ready_queue_history if available (for RR)
    if 'ready_queue_history' in result:
        response['ready_queue_history'] = result['ready_queue_history']

    return response


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
        'avgTurnaroundTime': round(avg_turnaround, 2)  # Updated key
    }

# FCFS Implementation


def fcfs(processes):
    timeline = []
    current_time = 0
    ready_queue_history = []

    # Sort by arrival time
    sorted_processes = sorted(processes, key=lambda x: x['arrival_time'])

    for p in sorted_processes:
        if current_time < p['arrival_time']:
            current_time = p['arrival_time']

        ready_queue = [proc['id'] for proc in sorted_processes if proc['arrival_time']
                       <= current_time and proc['id'] != p['id']]
        ready_queue_history.append(
            {'time': current_time, 'queue': ready_queue})

        timeline.append({
            'id': p['id'],
            'start': current_time,
            'end': current_time + p['burst_time']
        })
        current_time += p['burst_time']

    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline),
        'ready_queue_history': ready_queue_history
    }


# Round Robin Implementation
# def round_robin(processes, time_quantum):
#     timeline = []
#     queue = []
#     current_time = 0
#     remaining_time = {p['id']: p['burst_time'] for p in processes}
#     ready_queue_history = []

#     processes_dict = {p['id']: p for p in processes}

#     ready_queue_history = []


#     # Sort processes by arrival time
#     sorted_processes = sorted(processes, key=lambda x: x['arrival_time'])
#     queue = [p['id'] for p in sorted_processes]

#     while queue:
#         pid = queue.pop(0)
#         p = processes_dict[pid]

#         # Handle arrival time
#         if current_time < p['arrival_time']:
#             current_time = p['arrival_time']

#         # Calculate execution time
#         exec_time = min(remaining_time[pid], time_quantum)

#         # Add to timeline
#         timeline.append({
#             'id': pid,
#             'start': current_time,
#             'end': current_time + exec_time
#         })

#         # Update remaining time
#         remaining_time[pid] -= exec_time
#         current_time += exec_time

#         # Add processes that arrived during this execution
#         for p in sorted_processes:
#             if p['arrival_time'] <= current_time and \
#                p['id'] not in queue and \
#                remaining_time[p['id']] > 0 and \
#                p['id'] != pid:
#                 queue.append(p['id'])

#         # Re-add to queue if remaining time > 0
#         if remaining_time[pid] > 0:
#             queue.append(pid)

#     return {
#         'timeline': timeline,
#         'metrics': calculate_metrics(processes, timeline)
#     }

def round_robin(processes, time_quantum):
    timeline = []
    queue = []
    current_time = 0
    remaining_time = {p['id']: p['burst_time'] for p in processes}
    ready_queue_history = []

    processes_dict = {p['id']: p for p in processes}
    sorted_processes = sorted(processes, key=lambda x: x['arrival_time'])

    # Initialize queue with processes that have arrived at time 0
    for p in sorted_processes:
        if p['arrival_time'] <= current_time and p['id'] not in queue:
            queue.append(p['id'])

    while queue:
        # Log ready queue before execution
        ready_queue_history.append({
            'time': current_time,
            'queue': queue.copy()
        })

        pid = queue.pop(0)
        p = processes_dict[pid]

        # Handle case where current_time is behind arrival
        if current_time < p['arrival_time']:
            current_time = p['arrival_time']

        # Determine execution time
        exec_time = min(remaining_time[pid], time_quantum)

        # Add to timeline
        timeline.append({
            'id': pid,
            'start': current_time,
            'end': current_time + exec_time
        })

        # Advance time and update burst time
        current_time += exec_time
        remaining_time[pid] -= exec_time

        # Add newly arrived processes during this time window
        for proc in sorted_processes:
            if proc['arrival_time'] > p['arrival_time'] and \
               proc['arrival_time'] <= current_time and \
               proc['id'] not in queue and \
               remaining_time[proc['id']] > 0:
                queue.append(proc['id'])

        # Re-add current process if not finished
        if remaining_time[pid] > 0:
            queue.append(pid)

    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline),
        'ready_queue_history': ready_queue_history
    }


def sjf(processes):
    timeline = []
    current_time = 0
    remaining = [p.copy() for p in processes]
    ready_queue_history = []

    while remaining:
        # Get available processes sorted by burst time, then arrival_time
        available = [p for p in remaining if p['arrival_time'] <= current_time]
        ready_queue = sorted([p['id'] for p in available])
        ready_queue_history.append(
            {'time': current_time, 'queue': ready_queue})

        if not available:
            current_time += 1
            continue

        # Select process with shortest burst time
        next_proc = min(available, key=lambda x: (
            x['burst_time'], x['arrival_time'], x['id']))

        timeline.append({
            'id': next_proc['id'],
            'start': current_time,
            'end': current_time + next_proc['burst_time']
        })

        current_time += next_proc['burst_time']
        remaining.remove(next_proc)

    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline),
        'ready_queue_history': ready_queue_history
    }


def priority_scheduling(processes):
    """
    Non-preemptive Priority Scheduling implementation.
    Lower priority number indicates higher priority.
    If priority is missing, default is 0 (i.e., lowest priority).
    """
    ready_queue_history = []
    timeline = []
    current_time = 0

    # Ensure each process has a priority (default to 0)
    remaining_processes = []
    for p in processes:
        p_copy = p.copy()
        if 'priority' not in p_copy or p_copy['priority'] is None:
            p_copy['priority'] = 0
        remaining_processes.append(p_copy)

    while remaining_processes:
        arrived_processes = [
            p for p in remaining_processes if p['arrival_time'] <= current_time]
        ready_queue = sorted([p['id'] for p in arrived_processes])
        ready_queue_history.append(
            {'time': current_time, 'queue': ready_queue})

        if not arrived_processes:
            current_time = min(p['arrival_time'] for p in remaining_processes)
            continue

        selected_process = min(
            arrived_processes,
            key=lambda x: (x['priority'], x['arrival_time'], x['id'])
        )

        execution = {
            'id': selected_process['id'],
            'start': current_time,
            'end': current_time + selected_process['burst_time']
        }
        timeline.append(execution)

        current_time = execution['end']
        remaining_processes.remove(selected_process)

    return {
        'timeline': timeline,
        'metrics': calculate_metrics(processes, timeline),
        'ready_queue_history': ready_queue_history
    }
