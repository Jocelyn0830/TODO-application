from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine, get_db, SessionLocal

# -----------------------
# 数据模型
# -----------------------
class Todo(BaseModel):
    id: int
    title: str
    description: str | None = None
    completed: bool

    class Config:
        orm_mode = True


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
# 初始化数据库
# -----------------------
Base.metadata.create_all(bind=engine)

def init_db():

    """如果数据库为空，插入一些示例 todo。"""

    db = SessionLocal()

    try:

        # 如果已经有数据，就不再插入

        count = db.query(models.TodoModel).count()

        if count == 0:

            todos = [

                models.TodoModel(

                    title="买菜",

                    description="鸡蛋、番茄和牛奶。",

                    completed=False,

                ),

                models.TodoModel(

                    title="锻炼 30 分钟",

                    description="简单跑步或拉伸。",

                    completed=True,

                ),

                models.TodoModel(

                    title="回复工作邮件",

                    description="",

                    completed=False,

                ),

            ]

            db.add_all(todos)

            db.commit()

    finally:

        db.close()

# 初始化数据库
init_db()


# -----------------------
# Routes
# -----------------------

@app.get("/")
def read_root():
    return {"message": "Todo 后端已启动"}


@app.get("/todos", response_model=List[Todo])
def read_todos(db: Session = Depends(get_db)):
    """
    从 SQLite 数据库中读取所有 todo。
    """
    todos = db.query(models.TodoModel).all()
    return todos
