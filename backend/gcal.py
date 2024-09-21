import math

# Find the next availble study event they can do and still have 15 min rest
# Return -1 is none is available
def round_up_nearest_half(x):
    return math.ceil(x * 2) / 2

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
        result.append({"start_day": day, "start_time": start, "study_event": event["title"]})
        
        start += event["time"] / 60 + .25
        start = round_up_nearest_half(start)
    
        nextEvent = findAvailableEvent(end - start, studyEvents)
    
    return result
        
def integrate(existing, studyEvents, early, end):
    # existing event format: [{start: 1, end: 5, date: 2},... ]
    # studyEvent: [{title: "fdsfa", time: .5, priority: 3}]
    # NEED TO SORT EVENTS BY PRIORITY
    
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

studyEvents =[
	{
		"agenda": "Study the concept of classes in Python by creating a simple class with attributes and methods. Implement a small project that utilizes both inheritance and encapsulation to reinforce your understanding.",
		"time": 20,
		"title": "Classes in Python"
	},
	{
		"agenda": "Practice defining various types of functions in Python. Create a set of functions with parameters and return statements, including at least one lambda function for a simple operation. Test your functions with different inputs.",
		"time": 15,
		"title": "Functions in Python"
	},
	{
		"agenda": "Review control flow constructs in Python by writing a program that utilizes conditional statements and loops. Include exception handling to deal with potential errors, and test your program with different scenarios.",
		"time": 25,
		"title": "Control Flow in Python"
	}
]

print(integrate(existing, studyEvents, 9, 19))

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
