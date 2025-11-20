# TODO-application

## 运行代码

### 前端
```
cd TODO-application
npm --prefix frontend install
npm --prefix frontend start
```

前端默认运行在
```
http://localhost:3000
```

### 后端
```
cd TODO-application
uvicorn backend.main:app --reload
```

后端默认运行在：
```
http://127.0.0.1:8000
```

查看 JSON 数据
```
http://127.0.0.1:8000/todos
```

使用 Swagger API 测试接口
```
http://127.0.0.1:8000/docs
```

SQLite 数据库会自动生成：todos.db
