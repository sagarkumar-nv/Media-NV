"use client";

import React, { useState } from "react";
import axios from "axios";

export default function CreateTodo() {
    const [todo, setTodo] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!todo.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/todo/", {
                text: todo,
            });

            console.log(res.data);
            alert("Task Added");
            setTodo("");
        } catch (err) {
            console.log(err);
            alert("Todo is not Fetched");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
  <div className="-10 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6">
      
      <h1 className="text-2xl font-bold text-center text-white mb-6">
        Add TODO
      </h1>

     <form 
  onSubmit={handleSubmit} 
  className="space-y-4 flex flex-col items-center"
>
  <input
    type="text"
    placeholder="Enter task"
    value={todo}
    onChange={(e) => setTodo(e.target.value)}
    className="w-full px-4 py-2 rounded-lg 
               bg-gray-700 text-white placeholder-gray-400
               border border-gray-600
               focus:outline-none focus:ring-2 
               focus:ring-blue-500"
  />

  <button
    type="submit"
    disabled={loading}
    className={`w-20 py-2 rounded-lg font-semibold text-white
      transition duration-200
      ${loading
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-gray-600 hover:bg-blue-700"
      }`}
  >
    {loading ? "Posting..." : "Submit"}
  </button>
</form>

    </div>
  </div>
</>

    );
}
