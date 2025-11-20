# TODO List 项目说明文档

## 1. 技术选型
### **编程语言**
- JavaScript（前端)
  
  理由：React核心语言，个人熟练
- Python（后端）

  理由：个人熟练、生态成熟、FastAPI 性能强、语法简单，非常适合快速开发 REST API

### **框架/库**
- 前端：React + Tailwind CSS

  - 理由：

    - React：
        - 组件化、高扩展性、社区支持强
        - create-react-app：一条命令启动开发环境
        - 个人有使用经历
    - Tailwind CSS：
        - 原子化样式，极大提升开发效率
        - 个人有使用经历
          
  - 替代方案对比：

    - Vue：React 社区更广，个人无使用经验
    - Bootstrap：样式限制较多，不够灵活
      
- 后端框架：FastAPI

  - 理由：
    - 语法简洁
    - 自带 Swagger (/docs)，方便调试
    - 自带 Pydantic 校验，API 数据结构清晰
    - 个人有使用经历

  - 替代方案对比：

    - Flask：轻量但无类型系统，需要手动验证比较麻烦

    - Django：功能强大但过重，不适合简单应用程序
      
### **数据库/存储**
- 数据库：SQLite

  - 理由：
      - 内置于 Python，零配置即可使用
      - 轻量级，适合单机 Web 应用
      - 数据持久化能力比 localStorage 或 JSON 文件更规范
      - 迁移简单，部署成本低

  - 替代方案对比：
      - PostgreSQL / MySQL：强大但配置成本高，不适合简单应用程序
      - MongoDB：更适合不规则数据

## 2. 项目结构设计

### **整体架构说明**
```
React 前端  <---- HTTP JSON ---->  FastAPI 后端  <---- SQL ---->  SQLite 数据库
```
前端负责 UI 展示与交互；

后端提供标准 REST API 负责新增、读取、修改和删除待办事项；

SQLite 完成数据持久化。

### **目录结构示例**
```
project/
│
├── backend/
│   ├── main.py            # FastAPI 路由
│   ├── models.py          # SQLAlchemy ORM 模型
│   ├── database.py        # SQLite 连接配置
│   └── todos.db           # 自动生成的数据库文件
│
└── frontend/
    ├── src/
    │   ├── App.js         # 主 UI + API 调用逻辑
    │   └── index.js
    └── package.json
```

### **模块职责说明**

- backend/main.py

  - 定义所有 API 路由 (/todos)
  - 添加、删除、更新、读取 todo
  - 数据验证（Pydantic）
  - 粗略排序
  - 初始化示例数据

- backend/models.py
  - 定义 TodoModel（id/title/description/completed/due_date）

- backend/database.py
    - SQLite 连接
    - 提供可注入的数据库 Session

- frontend/App.js
    - 加载后端数据
    - 表单输入：标题/描述/截止日期
    - 调用 API: POST, PUT, DELETE
    - 排序逻辑：未完成在前 + 截止日期从近到远
    - UI 构建（Tailwind）

 ## 3. 需求细节与决策
 - 表单字段
   - 标题（必填）：为空时禁用“添加”按钮
   - 描述（可选）
   - 截止日期（可选）

- 空输入处理
  - 若标题为空：前端直接禁用按钮，避免发送无效请求
  - 若描述为空：设置为 null
  - 若截止日期为空：设置为 null

- 待办项显示方式
  - 已完成事项显示：
    - 标题出现删除线
    - 显示绿色小标签 “已完成”
  - 未完成事项：
    - 标题保持正常
    - 排序优先

- 排序逻辑
  - 排序在前端处理：
    - 未完成优先
    - 按截止日期从近到远排序
    - 无截止日期的排在最后
  - 理由：
    - 便于用户优先处理即将到期的事项
    - 保持界面一致性
   
- 扩展功能
  - 可滚动列表视图：当任务过多时不卡顿
  - 自适应高度（使用 Tailwind 的 h-[92vh]）
  - 后端 SQLite 持久化，刷新页面不会丢数据

## 4. AI 使用说明
### **使用的 AI 工具: ChatGPT（用于辅助开发和文档编写)**

- AI 使用环节
  - 前端优化
    - Tailwind CSS 布局
    - 响应式卡片高度
    - 排序逻辑优化
  - 后端代码生成
    - 创建 Pydantic 模型
  - Bug 定位
    - 解决 “relative import” 错误
- AI 输出的修改
  - AI 默认的排序逻辑被我修改为：未完成优先 + 截止日期优先
  - AI 给出的后端模型未包含截止日期字段，我主动完成扩展并对齐前端结构
 
## 5. 运行与测试方式

### 运行方式

- 前端
```
cd TODO-application
npm --prefix frontend install
npm --prefix frontend start
```

前端默认运行在
```
http://localhost:3000
```

- 后端
```
cd TODO-application
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

### **已测试环境**
- macOS
- Python 3.10+
- Chrome / Safari 浏览器

### **已知问题**
- 未包含编辑 Todo（修改标题/描述）的 UI
- 当前 UI 未做移动端适配（PC 显示最佳）

## 6. 总结与反思
- 如果有更多时间，我会改进：
  - 添加 Todo 编辑功能（支持修改标题/描述/截止日期）
  - 添加按“仅看未完成/全部”的筛选按钮
  - 增加搜索栏
  - 增加优先级、提醒机制

- 本项目最大的亮点
  - 使用 SQLite 做持久化，结构清晰
  - 排序逻辑处理得很细：未完成 + 根据截止日期排序
  - 整个 UI 使用 Tailwind编写，结构简洁、响应式良好
