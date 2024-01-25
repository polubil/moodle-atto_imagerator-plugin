import os.path

from fastapi.testclient import TestClient
from app import app
from regex import match


def test_generate_picture():
    with TestClient(app) as client:
        response = client.get(
            url="/picture/generate",
            params={
                "prompt": "Красная машина едет по мокрой дороге",  # Example text in Russian
                "width": 512,
                "height": 512,
                "steps": 2
            },
            follow_redirects=True
        )
        current, previous = response, response.history[0]
        assert previous.status_code == 307
        assert current.status_code == 200
        img_hash = match("/picture/[0-9]+", current.url.path)[0].replace("/picture/", "")
        assert img_hash
        response = client.get(f"/picture/{img_hash}")
        assert response.status_code == 200
        assert response.headers['content-type'] == 'image/png'
        assert os.path.exists(f"results/{img_hash}.png")
