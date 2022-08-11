from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from databases import Database
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import json

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="MeetingPage/static"), name="static")

templates = Jinja2Templates(directory="MeetingPage/templates")


@app.get('/')
def home():
    return 'Hello world'


@app.get("/meeting/{code}")
def meeting(request: Request, code: str):
    return templates.TemplateResponse('Chatting.html', {"request": request, "code": code})


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            datas = {'client_id': client_id, 'data': data}
            await manager.broadcast(json.dumps(datas))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")


class Chat(BaseModel):
    message: str
    user: str
    time: str


class Room(BaseModel):
    title: str
    users: str
    password: str
    code: str
    record: str


class Memo(BaseModel):
    title: str
    content: str


database = Database("sqlite:///./database/database.db")


@app.on_event("startup")
async def database_connect():
    await database.connect()


@app.on_event("shutdown")
async def database_disconnect():
    await database.disconnect()


@app.post('/api/database/chatting')
async def post_chat_message(chat: Chat):
    chat_dict = chat.dict()

    query = "INSERT INTO chat (message, user, time) VALUES (:message, :user, :time)"
    results = await database.execute_many(query=query, values=[chat_dict])

    return results


@app.get('/api/database/chatting')
async def get_chat_message():
    query = "SELECT * FROM chat"
    results = await database.fetch_all(query=query)

    return results


@app.post('/api/database/meeting')
async def create_meeting_room(room: Room):
    room_dict = room.dict()

    query = "INSERT INTO meeting_list (title, users, password, code, record) VALUES (:title, :users, :password, :code, :record)"

    results = await database.execute(query=query, values=room_dict)

    return results


@app.get('/api/database/meeting')
async def get_meeting_room(code: str):
    if code == '':
        query = "SELECT * FROM meeting_list WHERE record = 'true'"
        results = await database.fetch_all(query=query)
    else:
        query = f"SELECT * FROM meeting_list WHERE code = '{code}'"
        results = await database.fetch_one(query=query)
    return results


@app.delete('/api/database/meeting/{meeting_num}')
async def delete_meeting_room(meeting_num: int):
    query = f"DELETE FROM meeting_list WHERE number = {meeting_num}"
    results = await database.execute(query=query)

    return results


@app.post('/api/database/memo')
async def create_memo(memo: Memo):
    from datetime import datetime
    now = datetime.now()

    memo_dict = memo.dict()

    memo_title = memo_dict['title']
    memo_content = memo_dict['content']

    query = "INSERT INTO memo (title, content, time) VALUES (:title, :content, :time)"

    value = {
        'title': memo_title,
        'content': memo_content,
        'time': str(now.date())
    }

    results = await database.execute(query=query, values=value)

    return results


@app.get('/api/database/memo')
async def get_memo():
    query = "SELECT * FROM memo"
    results = await database.fetch_all(query=query)

    return results


@app.delete('/api/database/memo/{memo_num}')
async def delete_memo(memo_num: int):
    query = f"DELETE FROM memo WHERE number = {memo_num}"
    results = await database.execute(query=query)

    return results
