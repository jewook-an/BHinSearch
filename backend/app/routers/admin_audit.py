from fastapi import APIRouter, Depends
from typing import List
from app.database import get_db
from datetime import datetime

router = APIRouter()

@router.get("/")
async def list_audit_logs(skip: int = 0, limit: int = 10, db = Depends(get_db)):
    """감시 로그 조회"""
    logs = await db.audit_logs.find().skip(skip).limit(limit).sort("_id", -1).to_list(limit)

    return [
        {
            "id": str(log["_id"]),
            "adminId": log.get("adminId", ""),
            "adminName": log.get("adminName", ""),
            "action": log.get("action", ""),
            "resource": log.get("resource", ""),
            "resourceId": log.get("resourceId", ""),
            "timestamp": str(log.get("timestamp", "")),
            "ipAddress": log.get("ipAddress", ""),
            "userAgent": log.get("userAgent", "")
        }
        for log in logs
    ]

@router.post("/")
async def create_audit_log(data: dict, db = Depends(get_db)):
    """감시 로그 기록"""
    log_data = {
        **data,
        "timestamp": datetime.utcnow()
    }
    result = await db.audit_logs.insert_one(log_data)
    return {"id": str(result.inserted_id)}
