import datetime
import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pprint import pprint

load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

client = MongoClient(MONGODB_URI)
db = client['sample_mflix']
movies = db['movies']

pprint(movies.find_one({'title': 'The Great Train Robbery'}))
