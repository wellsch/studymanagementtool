import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from bson.objectid import ObjectId
import datetime
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
# from gpt import get_study_plan

app = Flask(__name__)
CORS(app)

load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
client = MongoClient(MONGODB_URI)
print(CLIENT_ID)
print(CLIENT_SECRET)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/login', methods=['POST'])
def login():
    name = request.json.get("name")
    email = request.json.get("email")

    exists = client['studymanagementtool']['users'].find_one({"email": email})
    
    if not exists:
        result = client['studymanagementtool']['users'].insert_one({
            "name": name,
            "class_ids": [],
            "email": email
        })
        return jsonify({"_id": str(result.inserted_id)}), 201
    else:
        return jsonify({"_id": str(exists["_id"])}), 201

@app.route('/class', methods=['POST', 'GET'])
def class_():
    if request.method == 'POST':
        name = request.json.get("name")
        email = request.json.get("email")
        priority = request.json.get("priority")

        result = client['studymanagementtool']['classes'].insert_one({
            "email": email,
            "notes": [],
            "study_plan": [],
            "priority": priority,
            "name": name
        })

        client['studymanagementtool']['users'].update_one(
            {"email": email},
            {"$push": {"class_ids": {"_id": str(result.inserted_id), "name": name}}}
        )
        
        return jsonify({"_id": str(result.inserted_id)}), 201

    else:
        id = request.json.get("_id")
        entry = client['studymanagementtool']['classes'].find_one({"_id": ObjectId(id)})
        entry["_id"] = str(entry["_id"])
        return jsonify(entry), 200

@app.route('/classes', methods=['GET'])
def classes():
    email = request.json.get("email")
    entry = client['studymanagementtool']['users'].find_one({"email": email})
    
    if entry: return jsonify(entry['class_ids']), 200
    else: return jsonify({"error": "not found"}), 404

@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        id = request.json.get("_id")
        notes = request.json.get("notes")

        result = client['studymanagementtool']['classes'].update_one(
            {"_id": ObjectId(id)}, 
            {"$push": {"notes": {"date": str(datetime.datetime.now()), "content": notes, "enabled": True}}}
        )

        if result.modified_count == 1: return jsonify({"status": "success"}), 200
        else: return jsonify({"error": "notes not inserted"}), 404

    else:
        id = request.json.get("_id")
        entry = client['studymanagementtool']['classes'].find_one({"_id": ObjectId(id)})

        if entry: return jsonify(entry['notes']), 200
        else: return jsonify({"error": "not found"}), 404

@app.route('/study', methods=['GET'])
def study():

    id = request.json.get("_id")
    entry = client['studymanagementtool']['classes'].find_one({"_id": ObjectId(id)})
    notes = [note["content"] for note in entry["notes"] if note["enabled"]]
    name = entry["name"]

    study_plan = get_study_plan(name, notes)

    client['studymanagementtool']['classes'].update_one(
        {"_id": ObjectId(id)}, 
        {"$set": {"study_plan": study_plan}}
    )

    return jsonify(study_plan), 200

@app.route('/calendar', methods=['POST'])
def calendar():
    token_str = request.json.get("token")
    print(token_str)
    creds = Credentials(token=token_str, client_id=CLIENT_ID, client_secret=CLIENT_SECRET, token_uri="https://oauth2.googleapis.com/token",scopes=["https://www.googleapis.com/auth/calendar.readonly"])
    service = build('calendar', 'v3', credentials=creds)
    events = get_upcoming_events(service)
    return jsonify(events), 200

def get_upcoming_events(service, max_results=10):
    print("WE IN")
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