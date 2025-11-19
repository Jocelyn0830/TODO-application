from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# -----------------------
# 数据模型
# -----------------------
class Todo(BaseModel):
    id: int
    title: str
    description: str | None = None
    completed: bool


# -----------------------
# 初始化应用
# -----------------------
app = FastAPI(title="Todo后端示例")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------
# dummy数据
# -----------------------
mock_todos = [
    Todo(
        id=1,
        title="买菜",
        description="鸡蛋、番茄和牛奶。",
        completed=False,
    ),
    Todo(
        id=2,
        title="锻炼 30 分钟",
        description="简单跑步或拉伸。",
        completed=True,
    ),
    Todo(
        id=3,
        title="回复工作邮件",
        description="",
        completed=False,
    ),
]


# -----------------------
# Routes
# -----------------------

@app.get("/")
def read_root():
    return {"message": "Todo 后端已启动"}


@app.get("/todos", response_model=List[Todo])
def read_todos():
    # dummy数据
    return mock_todos
