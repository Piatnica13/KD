from dotenv import load_dotenv
import os


load_dotenv(".password.env")

class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY") or "dev-key"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True
    }
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL is not set")