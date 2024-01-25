from random import getrandbits


def gen_pic(
        pipeline,
        prompt: str,
        steps: int = 4,
        height: int = 512,
        width: int = 512,
) -> int:
    image = pipeline(prompt=prompt,
                     num_inference_steps=steps,
                     height=height,
                     width=width,
                     guidance_scale=0.0).images[0]
    hash = getrandbits(128)
    img_name = f"results/{hash}.png"
    image.save(img_name)

    return hash
