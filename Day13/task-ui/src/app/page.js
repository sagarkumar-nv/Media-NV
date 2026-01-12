'use client';

import { useEffect, useState } from "react";
import api from "./api-response/api";

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState(false); // boolean
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/todo");
      setTodos(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitTodo = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        status, // boolean
      };

      if (editId !== null) {
        await api.patch(`/todo/${editId}`, payload);
      } else {
        await api.post("/todo", payload);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.log("Backend error:", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus(false);
    setEditId(null);
  };

  const removeTask = async (id) => {
    try {
      await api.delete(`/todo/${id}`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete task.", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">

        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Todo App
        </h1>

        {/* Form */}
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value === "true")}
          >
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={submitTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              {editId !== null ? "Update Task" : "Add Task"}
            </button>

            {editId !== null && (
              <button
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg w-full"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <hr className="my-6" />

        {/* List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">
                    {todo.title}
                    <span
                      className={`ml-2 text-sm px-2 py-1 rounded ${
                        todo.status
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {todo.status ? "Completed" : "Pending"}
                    </span>
                  </h3>

                  <p className="text-gray-600">{todo.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setEditId(todo.id);
                      setTitle(todo.title);
                      setDescription(todo.description || "");
                      setStatus(todo.status);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => removeTask(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
