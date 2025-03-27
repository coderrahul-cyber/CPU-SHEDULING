def validate_processes(processes):
    """Additional validation logic"""
    ids = [p['id'] for p in processes]
    if len(ids) != len(set(ids)):
        raise ValueError("Process IDs must be unique")
    return True

def convert_timeline(timeline):
    """Convert timeline to frontend-friendly format"""
    return [{
        'id': entry['id'],
        'start': entry['start'],
        'end': entry['end']
    } for entry in timeline]