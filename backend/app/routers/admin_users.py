from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from bson.objectid import ObjectId

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    status: str
    role: str
    createdAt: str

@router.get("/", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 10, db = Depends(get_db)):
    """사용자 목록 조회"""
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)

    return [
        {
            "id": str(user["_id"]),
            "email": user.get("email", ""),
            "username": user.get("username", ""),
            "status": user.get("status", "ACTIVE"),
            "role": user.get("role", "USER"),
            "createdAt": str(user.get("createdAt", ""))
        }
        for user in users
    ]

@router.get("/{user_id}")
async def get_user(user_id: str, db = Depends(get_db)):
    """특정 사용자 조회"""
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user.get("email", ""),
        "username": user.get("username", ""),
        "status": user.get("status", "ACTIVE"),
        "role": user.get("role", "USER")
    }

@router.put("/{user_id}")
async def update_user(user_id: str, data: dict, db = Depends(get_db)):
    """사용자 정보 수정"""
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}

@router.delete("/{user_id}")
async def delete_user(user_id: str, db = Depends(get_db)):
    """사용자 삭제"""
    result = await db.users.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
