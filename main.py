from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from gpt_request import insert_in_chatGPT

app = FastAPI()


class Item(BaseModel):
    """
    This class determines the types of tapes sent
    """
    request_for_catGPT: str


allow_all = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_all,
    allow_credentials=True,
    allow_methods=allow_all,
    allow_headers=allow_all
)
origins = [
    "http://localhost:3000"
]


@app.post("/")
async def create_item(item: Item):
    """
    :param item: The question sent to chatGPT
    :return:
        The answer from chatGPT
    """
    return insert_in_chatGPT(item.request_for_catGPT)


if __name__ == "__main__":
    uvicorn.run("main:app")
