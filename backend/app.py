from flask import Flask, request, jsonify
from dotenv import load_dontenv
from pymongo import MongoClient
import os
from bson.objectid import ObjectId
from datetime import datetime
from gpt import get_study_plan


app = Flask(__name__)

load_dontenv()
MONGODB_URI = os.environ['MONGODB_URI']
client = MongoClient(MONGODB_URI)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/account', methods=['POST'])
def account():
    pass

@app.route('/class', methods=['POST'])
def create_class():

    name = request.json.get("name")
    user_id = request.json.get("user_id")
    priority = request.json.get("priority")

    result = client['studymanagementtool']['classes'].insert_one({
        "user_id": user_id,
        "notes": [],
        "study_plan": [],
        "priority": priority,
        "name": name
    })
    
    return jsonify({"id": str(result.inserted_id)}), 201

@app.route('/notes', methods=['GET', 'POST'])
def notes():

    if request.method == 'POST':

        id = request.json.get("id")
        notes = request.json.get("notes")

        result = client['studymanagementtool']['classes'].update_one(
            {"_id": ObjectId(id)}, 
            {"$push": {"notes": {"date": str(datetime.now()), "content": notes, "enabled": True}}}
        )

        if result.modified_count == 1: return jsonify({"status": "success"}), 200
        else: return jsonify({"error": "notes not inserted"}), 404

    else:
        id = request.json.get("id")
        entry = client['studymanagementtool']['classes'].find_one({"_id": ObjectId(id)})

        if entry: return jsonify(entry['notes']), 200
        else: return jsonify({"error": "not found"}), 404

@app.route('/study', methods=['GET'])
def study():

    id = request.json.get("id")
    entry = client['studymanagementtool']['classes'].find_one({"_id": ObjectId(id)})
    notes = [note["content"] for note in entry["notes"] if note["enabled"]]
    name = entry["name"]

    study_plan = get_study_plan(name, notes)

    client['studymanagementtool']['classes'].update_one(
        {"_id": ObjectId(id)}, 
        {"$set": {"study_plan": study_plan}}
    )

    return jsonify(study_plan), 200

@app.route('/calendar', methods=['GET'])
def calendar():
    pass

if __name__ == '__main__':
    app.run(debug=True)