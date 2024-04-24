import certifi
from dotenv import dotenv_values
import urllib
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
from utils.auth import hash_passw, verify_passw, decrypt_jwt

env = dotenv_values(".env")


def get_database_uri():
    user = urllib.parse.quote(env.get("MONGO_USER"))
    passw = urllib.parse.quote(env.get("MONGO_PASS"))
    return f"mongodb+srv://{user}:{passw}@cluster0.l0fyh7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongo_client = MongoClient(get_database_uri(), tlsCAFile=certifi.where())
database = mongo_client[env.get("DB_NAME")]

def account_exists(email):
    try:
        filter = {"email": email}
        return database["account"].find_one(filter)
    except InvalidId:
        return {}

def create_account(account):
    hashed_passw = hash_passw(account["password"])
    account.update({"password": hashed_passw})
    return database["account"].insert_one(account)

def create_chat(chat):
    return database["chats"].insert_one(chat)

def chat_exists(_id):
    try:
        filter = {
            "_id": ObjectId(_id)
        }
        data = database["chats"].find_one(filter)
        data.update({"_id": str(data['_id'])})
        return data
    except InvalidId:
        return {}

def get_chat_list():
    data = database["chats"].find()
    chat_list = []
    for chat in data:
        new_chat = chat
        new_chat.update({"_id": str(new_chat['_id'])})
        chat_list.append(new_chat)
    return chat_list

def verify_token(token):
    info = decrypt_jwt(token)
    return account_exists(info["email"])

def add_chat_history(message):
    filter = {
        "_id": message["chat"],
    }
    update = {
        "$push": {
            "history": message
        }
    }
    return database["chats"].update_one(filter, update)