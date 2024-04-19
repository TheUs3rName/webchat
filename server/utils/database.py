import certifi
from dotenv import dotenv_values
import urllib
from pymongo import MongoClient
from utils.auth import hash_passw, verify_passw

env = dotenv_values(".env")


def get_database_uri():
    user = urllib.parse.quote(env.get("MONGO_USER"))
    passw = urllib.parse.quote(env.get("MONGO_PASS"))
    return f"mongodb+srv://{user}:{passw}@cluster0.l0fyh7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongo_client = MongoClient(get_database_uri(), tlsCAFile=certifi.where())
database = mongo_client[env.get("DB_NAME")]

def account_exists(email):
    filter = {"email": email}
    return database["account"].find_one(filter)


def create_account(account):
    hashed_passw = hash_passw(account["password"])
    account.update({"password": hashed_passw})
    return database["account"].insert_one(account)

def create_chat(chat):
    return database["chats"].insert_one(chat)

def get_chat_list():
    data = database["chats"].find()
    chat_list = []
    for chat in data:
        _id = chat["_id"]
        chat.pop("_id")
        chat.update({"_id": str(_id)})
        chat_list.append(chat)
    return chat_list