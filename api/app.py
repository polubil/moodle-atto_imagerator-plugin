import os.path

import torch
from diffusers import DiffusionPipeline
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import gen_pic
from contextlib import asynccontextmanager
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.exceptions import HTTPException
from translate import Translator


translator: Translator = Translator(from_lang="ru",  to_lang="en")
models: dict = {}
model_name: str = "stabilityai/sdxl-turbo"
accuracy: str = "fp16"


@asynccontextmanager
async def lifespan(app: FastAPI) -> None:
    if not models.get("sdxl-turbo"):
        models["sdxl-turbo"] = DiffusionPipeline.from_pretrained(
            pretrained_model_name_or_path=model_name,
            torch_dtype=torch.float16 if accuracy == "fp16" else torch.float32,
            variant=accuracy
        )
        models["sdxl-turbo"].to("cuda" if torch.cuda.is_available() else "cpu")
    if not os.path.isdir("results"):
        os.makedirs("results")
    yield
    models.clear()


app = FastAPI(lifespan=lifespan)

origins: list[str] = [
    "http://89.223.100.100",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/picture/generate")
async def generate_picture(prompt: str, width: int = 512, height: int = 512, steps: int = 1) -> RedirectResponse:
    prompt_en: str = translator.translate(prompt)
    result_hash: int = gen_pic(models["sdxl-turbo"], prompt_en, steps, height, width)
    return RedirectResponse(f"/picture/{result_hash}")


@app.get("/picture/{hash}")
async def result(hash: str) -> FileResponse:
    path_to_image: str = "results/" + hash + ".png"
    if os.path.exists(path_to_image):
        return FileResponse(status_code=200, path=path_to_image)
    else:
        raise HTTPException(status_code=404, detail="Not Found")
