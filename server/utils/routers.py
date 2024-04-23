from fastapi import APIRouter, Cookie, UploadFile, File, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.responses import JSONResponse
from utils.responses import Messages
from utils.models import Account, Chat
from utils.database import verify_token , chat_exists, create_account, account_exists, get_chat_list, create_chat
from utils.auth import encrypt_jwt, decrypt_jwt, verify_passw
import json
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

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

    token = encrypt_jwt({"email": account.email, "_id": str(exists["_id"])})

    response = JSONResponse(Messages.OK, 200)
    response.set_cookie(key="token",
                        value=token,
                        max_age=3600,
                        path="/",
                        httponly=True)
    return response

@router.get("/chats")
async def get_chats_endpoint():
    return JSONResponse(get_chat_list(), status_code=200)

@router.get("/auth/whoami")
async def whoami_endpoint(token: str = Cookie(default=None)):
    if (verify_token(token)):
        info = decrypt_jwt(token)
        return JSONResponse(info, status_code=200)
    return JSONResponse(Messages.UNAUTHORIZED, status_code=401)

@router.post("/chats")
async def create_chat_endpoint(chat: Chat, token: str = Cookie(default=None)):
    if not verify_token(token):
        return JSONResponse(Messages.UNAUTHORIZED, status_code=401)
    info = decrypt_jwt(token)
    ch = json.loads(chat.model_dump_json())
    ch["owner"] = info["_id"]
    create_chat(ch)
    return JSONResponse(Messages.OK, status_code=201)


manager = ConnectionManager()

@router.websocket("/ws/chats/{chat_ids}")
async def ws_chats_endpoint(chat_ids: str, ws: WebSocket, token: str = Cookie(default=None)):
    await manager.connect(ws)
    
    if not verify_token(token):
        await ws.close(reason="unauthrized.")

    if not chat_exists(chat_ids):
        await ws.close(reason="chat not found.")

    await manager.send_personal_message({"history": []}, ws)

    while True:
        try:
            data = await ws.receive_json()
            print("data:", data, type(data))
            action = data.get("action", False)
            if action and action == "ping":
                await ws.send_json({"action": "pong"})

            await manager.broadcast(data)
        except WebSocketException as e:
            print(e)
