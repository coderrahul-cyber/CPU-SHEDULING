from flask import Flask, jsonify, request
from flask_cors import CORS
from models import ProcessSchema
from schedular import calculate_schedule
from marshmallow import ValidationError

app = Flask(__name__)
CORS(app)  

# Initialize schema for request validation
process_schema = ProcessSchema(many=True)

@app.route('/api/schedule', methods=['POST'])
def schedule_processes():
    
    try:
        # Validate and parse input
        data = request.get_json()
        processes = process_schema.load(data['processes'])
        
        # Get scheduling parameters
        algorithm = data.get('algorithm', 'FCFS')
        time_quantum = data.get('time_quantum', 1)


        # Calculate schedule
        result = calculate_schedule(
            processes=processes,
            algorithm=algorithm,
            time_quantum=time_quantum
        )

        return jsonify({
            'success': True,
            'timeline': result['timeline'],
            'metrics': result['metrics']
        }), 200

    except ValidationError as err:
        return jsonify({'success': False, 'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)