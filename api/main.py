import os

import uvicorn
from ngrok import ngrok

from app import app

if __name__ == "__main__":
    listener = ngrok.forward(8000, authtoken="paste_your_ngrok_token_here")
    print(f"Ingress established at {listener.url()}")
    uvicorn.run("app:app", reload=True, log_level="debug")
