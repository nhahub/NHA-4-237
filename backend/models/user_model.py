from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    

class UpdateProfile(BaseModel):
    name: str
    email: EmailStr    
    

class ChangePassword(BaseModel):
    current_password: str
    new_password: str    
    
class UserSettings(BaseModel):
    dark_mode: bool
    notifications: bool
    ai_model: str    