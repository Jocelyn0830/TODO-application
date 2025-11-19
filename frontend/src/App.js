const exampleTodos = [
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
    completed: true,
  },
  {
    id: 3,
    title: "回复工作邮件",
    description: "",
    completed: false,
  },
];


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        {/* 标题 */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          TODO List
        </h1>

        {/* 表单区域 */}
        <form className="mb-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: 和朋友约吃饭"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述（可选）
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              rows={2}
              disabled
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-400 text-white text-sm font-medium rounded-lg cursor-not-allowed"
            disabled
          >
            添加TODO
          </button>
        </form>

        {/* 待办事项列表 */}
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          待办事项：
        </h2>
        <ul className="space-y-3">
          {exampleTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-start justify-between border rounded-lg px-3 py-2"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}}
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
                      <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-0.5">
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
                className="text-xs text-red-400 cursor-not-allowed"
                disabled
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
