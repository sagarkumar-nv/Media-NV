"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/tasks/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Tasks fetched:", data);
        // Ensure data is always an array
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [token]);
  
  const addTask = async () => {
    if (!title) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    const newTask = data.task || data;
    setTasks([...tasks, newTask]);
    setTitle("");
  };

  const deleteTask = async (taskId) => {
    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Tasks</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-xl shadow-xl">
          {/* Add Task Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button 
                onClick={addTask}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks yet. Create one above!</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li 
                    key={task._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <span className="text-gray-800">{task.title}</span>
                    <button 
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

