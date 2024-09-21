import pickle
from flask import Flask, request, jsonify
from dotenv import load_dontenv
from pymongo import MongoClient
import os
from bson.objectid import ObjectId
import datetime
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build


app = Flask(__name__)

load_dontenv()
MONGODB_URI = os.environ['MONGODB_URI']
client = MongoClient(MONGODB_URI)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/class', methods=['POST'])
def create_class():
    name = request.json.get("name")
    user_id = request.json.get("user_id")
    priority = request.json.get("priority")

    result = client['studymanagementtool']['Classes'].insert_one({
        "user_id": user_id,
        "notes": [],
        "study_plan": [],
        "priority": priority,
        "name": name
    })
    
    return jsonify({"id": result.inserted_id}), 201

@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        id = request.json.get("id")
        notes = request.json.get("notes")

        result = client['studymanagementtool']['Classes'].update_one(
            {"_id": id}, 
            {"$push": {"notes": {"date": str(datetime.now()), "content": notes}}}
        )

        if result.modified_count == 1:
            return jsonify({"status": "success"}), 200
        else:
            return jsonify({"error": "notes not inserted"}), 404

    else:
        id = request.json.get("id")
        entry = client['studymanagementtool']['Classes'].find_one({"_id": ObjectId(id)})

        if entry:
            return jsonify(entry['notes']), 200
        else:
            return jsonify({"error": "not found"}), 404

@app.route('/study', methods=['GET'])
def study():
    id = request.json.get("id")

    pass

@app.route('/calendar', methods=['GET'])
def calendar():
    token = request.json.get("token")
    creds = pickle.load(token)
    service = build('calendar', 'v3', credentials=creds)
    events = get_upcoming_events(service)
    return jsonify(events), 200

def get_upcoming_events(service, max_results=10):
    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    print('Getting the upcoming {} events'.format(max_results))
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                          maxResults=max_results, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])
    
    if not events:
        print('No upcoming events found.')
        return []
    
    eventsInfo = []
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        end = event['end'].get('dateTime', event['end'].get('date'))
        print(f"Event: {event['summary']} at {start}")
        print(f"Event: {event['summary']} ends {end}")
        eventInfo = {}
        eventInfo["start"] = start
        eventInfo["end"] = end
        
    print(eventsInfo)
    return eventsInfo

if __name__ == '__main__':
    app.run(debug=True)