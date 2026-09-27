import os
from dotenv import load_dotenv

load_dotenv()

# Standard allowed origins including production Vercel domains
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://team-forge-frontend-one.vercel.app",
    "https://team-forge-frontend.vercel.app",
    "https://team-forge-isb-7-3.vercel.app",
]

# CORS configuration
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
if not raw_origins or raw_origins == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    env_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    # Combine with default production domains to guarantee Vercel access
    ALLOWED_ORIGINS = list(set(env_origins + DEFAULT_ORIGINS))

# Server configuration
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
