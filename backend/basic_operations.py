import datetime
import os

from dotenv import load_dontenv
from pymongo import MongoClient

load_dontenv()
MONGODB_URI = os.environ['MONGODB_URI']

client = MongoClient()