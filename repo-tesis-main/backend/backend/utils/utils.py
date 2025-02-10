from datetime import datetime, timedelta

def assign_appointment_time(urgency_level, available_hours):
    """Assigns an appointment time based on urgency level and availability."""
    now = datetime.now()
    
    # Define the maximum wait time per urgency level
    urgency_wait_times = {
        1: timedelta(minutes=0),    # Immediate
        2: timedelta(minutes=15),   # Max 15 minutes
        3: timedelta(minutes=60),   # Max 1 hour
        4: timedelta(minutes=120),  # Max 2 hours
        5: timedelta(minutes=240)   # Max 4 hours
    }
    
    max_wait_time = urgency_wait_times.get(urgency_level, timedelta(minutes=240))
    max_time = now + max_wait_time
    
    # Filter available hours that are within the allowed time frame
    available_times = [hour for hour in available_hours if now.time() <= datetime.strptime(hour, "%H:%M").time() <= max_time.time()]
    
    if available_times:
        appointment_time = available_times[0]  # Choose the earliest available slot
    else:
        # If no available slots within the timeframe, pick the next immediate available
        future_times = [hour for hour in available_hours if datetime.strptime(hour, "%H:%M").time() > max_time.time()]
        appointment_time = future_times[0] if future_times else available_hours[0]
    
    hour_min = appointment_time.split(":")
    return now.replace(hour=int(hour_min[0]), minute=int(hour_min[1]), second=0, microsecond=0)
