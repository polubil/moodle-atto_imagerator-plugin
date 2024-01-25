import os

import uvicorn
from ngrok import ngrok

from app import app

if __name__ == "__main__":
    uvicorn.run("app:app", reload=True, log_level="debug")
