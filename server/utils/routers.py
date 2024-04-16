from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.responses import Messages
from utils.models import Account
from utils.database import create_account, account_exists
from utils.auth import encrypt_jwt, decrypt_jwt, verify_passw
import json

router = APIRouter()


@router.get("/")
async def root_endpoint():
    return JSONResponse(Messages.OK, status_code=200)


@router.post("/auth/signup")
async def signup_endpoint(account: Account):
    exists = account_exists(account.email)
    if exists:
        return JSONResponse(Messages.ALREADY_EXISTS, status_code=422)
    acc = json.loads(account.model_dump_json())
    create_account(acc)
    return JSONResponse(Messages.CREATED, status_code=201)


@router.post("/auth/signin")
async def signin_endpoint(account: Account):
    exists = account_exists(account.email)
    if not exists:
        return JSONResponse(Messages.ACC_NOT_EXISTS, status_code=422)

    is_valid = verify_passw(exists["password"], account.password)
    if not is_valid:
        return JSONResponse(Messages.INVALID_CRED, status_code=422)

    token = encrypt_jwt({"email": account.email})
    response = JSONResponse(Messages.OK, 200)
    response.set_cookie(key="token",
                        value=token,
                        max_age=3600,
                        samesite="lax",
                        httponly=True)
    return response
