import enum


class Messages(enum.auto):
    OK = {"status": "OK"}
    CREATED = {"status": "OK", "message": "Account created."}
    ALREADY_EXISTS = {"status": "failed", "message": "account already exists."}
    ACC_NOT_EXISTS = {"status": "failed", "message": "account not found."}
    INVALID_CRED = {
        "status": "failed",
        "message": "invalid username or password."
    }
    
