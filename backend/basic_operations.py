import datetime
import os
import bson

from dotenv import load_dotenv
from pymongo import MongoClient
from pprint import pprint

load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

client = MongoClient(MONGODB_URI)
db = client['studymanagementtool']
classes = db['classes']
users = db['user']

c140 = classes.find_one({'name': 'COMP 140'})

pprint(c140)
