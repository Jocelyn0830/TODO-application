from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException

from . import models
from .database import Base, engine, get_db, SessionLocal

# -----------------------
# 数据模型
# -----------------------
class TodoOut(BaseModel):
    id: int
    title: str
    description: str | None = None
    completed: bool
    due_date: str | None = None

    class Config:
        orm_mode = True

class TodoCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None

class TodoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    due_date: str | None = None


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
        count = db.query(models.TodoModel).count()

        if count == 0:
            todos = [
                models.TodoModel(
                    title="买菜",
                    description="鸡蛋、番茄和牛奶。",
                    completed=False,
                    due_date="2025-11-30",
                ),
                models.TodoModel(
                    title="锻炼 30 分钟",
                    description="简单跑步或拉伸。",
                    completed=True,
                    due_date="2025-11-20",
                ),
                models.TodoModel(
                    title="回复工作邮件",
                    description="",
                    completed=False,
                    due_date=None,
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


@app.get("/todos", response_model=List[TodoOut])
def read_todos(db: Session = Depends(get_db)):
    """
    从 SQLite 数据库中读取所有 todo。
    """

    # 后端先粗排序，前端再精排序
    todos = (
        db.query(models.TodoModel)
        .order_by(models.TodoModel.completed.asc())
        .all()
    )

    return todos


# POST /todos
@app.post("/todos", response_model=TodoOut)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = models.TodoModel(
        title=todo.title,
        description=todo.description,
        completed=False,
        due_date=todo.due_date,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


# PUT /todos/{id}
@app.put("/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    item = db.query(models.TodoModel).filter(models.TodoModel.id == todo_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo.title is not None:
        item.title = todo.title
    if todo.description is not None:
        item.description = todo.description
    if todo.completed is not None:
        item.completed = todo.completed
    if todo.due_date is not None:
        item.due_date = todo.due_date

    db.commit()
    db.refresh(item)
    return item


# DELETE /todos/{id}
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    item = db.query(models.TodoModel).filter(models.TodoModel.id == todo_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(item)
    db.commit()
    return {"message": "已删除"}