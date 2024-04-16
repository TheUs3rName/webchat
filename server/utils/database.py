from dotenv import dotenv_values
import urllib
from pymongo import MongoClient
from utils.auth import hash_passw, verify_passw

env = dotenv_values(".env")


def get_database_uri():
    user = urllib.parse.quote(env.get("MONGO_USER"))
    passw = urllib.parse.quote(env.get("MONGO_PASS"))
    return f"mongodb+srv://{user}:{passw}@cluster0.l0fyh7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


print('connecting to db...')
mongo_client = MongoClient(get_database_uri())
database = mongo_client[env.get("DB_NAME")]
print('connected to db.')


def account_exists(email):
    filter = {"email": email}
    return database["account"].find_one(filter)


def create_account(account):
    hashed_passw = hash_passw(account["password"])
    account.update({"password": hashed_passw})
    return database["account"].insert_one(account)
