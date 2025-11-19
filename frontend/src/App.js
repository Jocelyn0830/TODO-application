// TODO: maybe improve sorting
// TODO: backend connection

import { useState, useEffect } from "react";

// uvicorn默认端口8000
const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  // ------------------------
  // State 管理
  // ------------------------
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [dueDate, setDueDate] = useState("");

  // TODO 排序
  // 排序：未完成在前，同一类里按截止日期从近到远（无截止日期排在后面）
  const sortTodos = (list) => {
    return [...list].sort((a, b) => {
      // 1. 先按 completed 排序：false(0) 在前，true(1) 在后
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed);
      }

      // 2. 再按截止日期排序（假设字段名为 due_date，字符串格式 YYYY-MM-DD）
      const ad = a.due_date || "";
      const bd = b.due_date || "";

      // 都没有截止日期
      if (!ad && !bd) return 0;
      // a 没有，b 有 -> a 靠后
      if (!ad) return 1;
      // a 有，b 没有 -> a 靠前
      if (!bd) return -1;

      // 都有截止日期：字符串比较即可（YYYY-MM-DD 是字典序=时间顺序）
      return ad.localeCompare(bd);
    });
  };



  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/todos`);
        if (!res.ok) {
          throw new Error(`状态码: ${res.status}`);
        }

        const data = await res.json();
        setTodos(sortTodos(data));
      } catch (err) {
        console.error("加载后端数据失败：", err);

        // 弹窗提醒用户后端错误
        alert("系统错误：无法加载待办事项，请稍后再试。");

        // 不显示数据
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // 调用后端添加 TODO
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate || null,
        }),
      });

      if (!res.ok) throw new Error("添加失败");

      const saved = await res.json();

      const newTodo = {
        ...saved,
        due_date: dueDate || null,
      };

      setTodos(sortTodos([newTodo, ...todos]));
      setTitle("");
      setDescription("");
      setDueDate("");

    } catch (error) {
      alert("系统错误：添加失败，请稍后再试。");
    }
  };

  // 调用后端update：切换完成状态
  const toggleCompleted = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !current,
        }),
      });

      if (!res.ok) throw new Error("更新失败");

      const updated = await res.json();

      setTodos(
        sortTodos(
          todos.map((todo) =>
            todo.id === id ? updated : todo
          )
        )
      );

    } catch (error) {
      alert("系统错误：更新失败，请稍后再试。");
    }
  };

  // 调用后端DELETE：删除 TODO
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("删除失败");

      setTodos(sortTodos(todos.filter((todo) => todo.id !== id)));

    } catch (error) {
      alert("系统错误：删除失败，请稍后再试。");
    }
  };

  // ------------------------
  // UI 渲染
  // ------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div
          className="w-full max-w-3xl h-[92vh] mx-auto p-8 bg-white rounded-2xl shadow-xl flex flex-col"
        >

        {/* 标题 */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          TODO List
        </h1>

        {/* 如果还在加载 */}

        {loading && (

          <p className="text-sm text-gray-500 mb-4">正在加载待办事项...</p>

        )}

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
              disabled={loading}
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

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截止日期（可选）
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
            disabled={!title.trim() || loading}
          >
            添加TODO
          </button>
        </form>

        {/* 待办事项列表 */}
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          待办事项：
        </h2>

        {/* 列表区域：固定高度 + 内部滚动 */}
        <div className="flex-1 min-h-0 border rounded-lg p-3 bg-gray-50">
          {!loading && todos.length === 0 && (
            <div className="text-sm text-gray-500">
              当前没有任何待办事项。
            </div>
          )}

          <div className="mt-1 h-full max-h-full overflow-y-auto pr-1">
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-start justify-between border rounded-lg px-3 py-2 bg-white"
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleted(todo.id, todo.completed)}
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

                      {/* 截止日期展示 */}
                      {todo.due_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          截止日期：{todo.due_date}
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

      </div>
    </div>
  );
}

export default App;
