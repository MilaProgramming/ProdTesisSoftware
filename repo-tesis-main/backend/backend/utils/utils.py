from datetime import datetime, timedelta


def assign_appointment_time(urgency_level, available_hours):
    """Assigns an appointment time based on urgency level and availability."""

    now = datetime.now()
    if now.strftime("%H:%M") > "18:00":
        now = now + timedelta(days=1)

    if urgency_level == 1:  # Resuscitation
        # Assign the first available time
        appointment_time = available_hours[0]
    elif urgency_level == 2:  # Emergency
        # Assign within the next 2 hours
        # Ensure it doesn't go out of range
        hour_index = min(len(available_hours) - 1, 2)
        appointment_time = available_hours[hour_index]
    elif urgency_level == 3:  # Urgency
        # Assign within the next 4 hours
        hour_index = min(len(available_hours) - 1, 4)
        appointment_time = available_hours[hour_index]
    elif urgency_level == 4:  # Minor urgency
        # Assign for tomorrow at 8 AM (if available)
        appointment_time = "09:00"
        if appointment_time not in available_hours:
            # If not available, assign the first available time tomorrow
            tomorrow = now + timedelta(days=1)
            tomorrow_8am = tomorrow.replace(
                hour=8, minute=0, second=0, microsecond=0)
            available_hours_tomorrow = [hour for hour in available_hours if datetime.strptime(
                hour, "%H:%M").time() >= tomorrow_8am.time()]
            if available_hours_tomorrow:
                appointment_time = available_hours_tomorrow[0]
            else:
                # If there are no available hours tomorrow, assign the first available hour
                appointment_time = available_hours[0]
    else:  # urgency_level == 5 (No urgency)
        # Assign for next week at 8 AM (if available)
        appointment_time = "09:00"
        if appointment_time not in available_hours:
            # If not available, assign the first available time next week
            next_week = now + timedelta(weeks=1)
            next_week_8am = next_week.replace(
                hour=8, minute=0, second=0, microsecond=0)
            available_hours_next_week = [hour for hour in available_hours if datetime.strptime(
                hour, "%H:%M").time() >= next_week_8am.time()]
            if available_hours_next_week:
                appointment_time = available_hours_next_week[0]
            else:
                # If there are no available hours next week, assign the first available hour
                appointment_time = available_hours[0]

    hour_min = appointment_time.split(":")
    return now.replace(hour=int(hour_min[0]), minute=int(hour_min[1]), second=0, microsecond=0)
