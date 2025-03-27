from marshmallow import Schema, fields, validate

class ProcessSchema(Schema):
    id = fields.Str(required=True)
    arrival_time = fields.Int(
        required=True,
        validate=validate.Range(min=0, error="Arrival time must be >= 0")
    )
    burst_time = fields.Int(
        required=True,
        validate=validate.Range(min=1, error="Burst time must be >= 1")
    )
    priority = fields.Int(
        validate=validate.Range(min=0, error="Priority must be >= 0")
    )

    class Meta:
        ordered = True
        fields = ('id', 'arrival_time', 'burst_time', 'priority')