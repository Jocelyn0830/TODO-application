// TODO: maybe improve sorting
// TODO: backend connection

import { useState } from "react";

const initialTodos = [
  {
    id: 1,
    title: "买菜",
    description: "鸡蛋、番茄和牛奶。",
    completed: false,
  },
  {
    id: 2,
    title: "锻炼 30 分钟",
    description: "简单跑步或拉伸。",
    completed: false,
  },
  {
    id: 3,
    title: "回复工作邮件",
    description: "",
    completed: true,
  },
];

function App() {
  // ------------------------
  // State 管理
  // ------------------------
  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // TODO 排序
  const sortTodos = (list) => {
  return [...list].sort((a, b) => Number(a.completed) - Number(b.completed));
  };


  // 添加 TODO
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    setTodos(sortTodos([newTodo, ...todos]));
    setTitle("");
    setDescription("");
  };

  // 切换完成状态
  const toggleCompleted = (id) => {
    setTodos(
      sortTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
    );
  };

  // 删除 TODO
  const deleteTodo = (id) => {
    setTodos(sortTodos(todos.filter((todo) => todo.id !== id)));
  };

  // ------------------------
  // UI 渲染
  // ------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">

        {/* 标题 */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          TODO List
        </h1>

        {/* 表单区域 */}
        <form onSubmit={handleAddTodo} className="mb-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: 和朋友约吃饭"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述（可选）
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: 商量下周周末是否有空"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={
              "inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg " +
              (title.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed")
            }
            disabled={!title.trim()}
          >
            添加TODO
          </button>
        </form>

        {/* 待办事项列表 */}
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          待办事项：
        </h2>

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-start justify-between border rounded-lg px-3 py-2"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo.id)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />

                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={
                        "font-medium text-sm " +
                        (todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800")
                      }
                    >
                      {todo.title}
                    </span>
                    {todo.completed && (
                      <span className="text-xs text-green-600 bg-green-50 
                                       border border-green-200 rounded px-2 py-0.5">
                        已完成
                      </span>
                    )}
                  </div>

                  {todo.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;
