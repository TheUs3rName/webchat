from hashlib import md5
import jwt
from dotenv import dotenv_values

env = dotenv_values(".env")


def hash_passw(password):
    return md5(password.encode()).hexdigest()


def verify_passw(hashed_passw, passw):
    return hashed_passw == md5(passw.encode()).hexdigest()


def encrypt_jwt(payload):
    encoded = jwt.encode(payload, env.get("SECRET"), algorithm="HS256")
    return encoded


def decrypt_jwt(token):
    decoded = jwt.decode(token, env.get("SECRET"), algorithms=["HS256"])
    return decoded
