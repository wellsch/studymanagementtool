import math
from datetime import datetime, timedelta

def create_datetime_string(date_str, days_after, military_time):
    # Parse the input date string
    base_date = datetime.strptime(date_str, "%Y-%m-%d")
    
    # Add the number of days
    target_date = base_date + timedelta(days=days_after)
    
    # Calculate hours and minutes from military time
    hours = int(military_time)
    minutes = int((military_time - hours) * 60)
    
    # Set the time for the target date
    target_date = target_date.replace(hour=hours, minute=minutes)

    # Format the date as an ISO 8601 string
    iso_date_string = target_date.isoformat()

    return iso_date_string

def create_event(service, start, end, title, agenda):

    timezone = service.calendars().get(calendarId='primary').execute().get('timeZone')

    event = {
        'summary': title, 
        'description': agenda,
        'start': {
            'dateTime': start,
            'timeZone': timezone,
        },
        'end': {
            'dateTime': end, 
            'timeZone': timezone,
        }
    }
    
    event_result = service.events().insert(calendarId='primary', body=event).execute()

def round_up_nearest_half(x):
    return math.ceil(x * 2) / 2

def round_up_to_nearest_quarter(num):
    return math.ceil(num * 4) / 4

def findAvailableEvent(timeAvailable, studyEvents):
    i = 0
    while i < len(studyEvents) and studyEvents[i]["time"] / 60 + .25 > timeAvailable:
        i += 1
    
    if i == len(studyEvents):
        return -1
    else:
        return i
    
def addEvents(start, end, day, studyEvents):
    result = []
    nextEvent = findAvailableEvent(end - start, studyEvents)
    while start < end and nextEvent != -1:
        # add the event to the result
        event = studyEvents.pop(nextEvent)
        result.append({"start_day": day, "start_time": start, "end_day": day, "end_time": round_up_to_nearest_quarter(start + event["time"] / 60 + .25), "study_event": event})
        
        start += event["time"] / 60 + .25
        start = round_up_nearest_half(start)
    
        nextEvent = findAvailableEvent(end - start, studyEvents)
    
    return result

def addToGCal(events, start_date):
    result = []
    for event in events:
        starting_date = create_datetime_string(start_date, event["start_day"], event["start_time"])
        ending_date = create_datetime_string(start_date, event["end_day"], event["end_time"])
        result.append({"start_date": starting_date, "end_date": ending_date, "title": event["study_event"]["title"], "agenda": event["study_event"]["agenda"]})
    
    return result
        
def integrate(existing, studyEvents, early, end):
    # sort the events by priority (highest to lowest priority)
    studyEvents.sort(key=lambda x: x["priority"], reverse=True)
    result = []
    day = 0
    time = early
    for event in existing:
        
        # Fill up the FULL days we have to study with 
        while day < event["start_date"]:
            
            # Add study events if we can
            result.extend(addEvents(time, end, day, studyEvents))
            
            day += 1
            time = early
        
        # Fill up the current day that the event is on for studying
        result.extend(addEvents(time, event["start_time"], day, studyEvents))
        
        day = event["end_date"]
        time = round_up_nearest_half(event["end_time"] + 0.25)
    
    return result

existing = [
    {
        "end_date": 0,
        "end_time": 10.0,
        "start_date": 0,
        "start_time": 9.0
    },
    {
        "end_date": 0,
        "end_time": 12.0,
        "start_date": 0,
        "start_time": 11.0
    },
    
    {
        "end_date": 1,
        "end_time": 4.0,
        "start_date": 0,
        "start_time": 12.0
    },
    
    {
        "end_date": 5,
        "end_time": 11.416666666666666,
        "start_date": 5,
        "start_time": 11.0
    },
    {
        "end_date": 12,
        "end_time": 10.0,
        "start_date": 12,
        "start_time": 9.0
    }
]

