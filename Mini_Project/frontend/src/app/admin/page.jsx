"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/user");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Input change handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Open modal to create new user
  const openCreateModal = () => {
    setEditId(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    });
    setModalOpen(true);
  };

  // Open modal to edit existing user
  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
    });
    setModalOpen(true);
  };

  // Submit create or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/user/${editId}`, form);
      } else {
        await api.post("/user/admin-create", form);
      }
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving user");
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="mr-4">Hello, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Add User Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto border border-green-500">
          <thead>
            <tr className="bg-green-900/40 text-green-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-green-900/20">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(u)}
                    className="bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded-xl w-96 border border-green-500 flex flex-col gap-4"
          >
            <h3 className="text-xl font-bold text-center">
              {editId ? "Edit User" : "Add User"}
            </h3>

            <input
              name="name"
              placeholder="Name"
              className="p-2 rounded bg-black text-green-400 border border-green-600"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="p-2 rounded bg-black text-green-400 border border-green-600"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              className="p-2 rounded bg-black text-green-400 border border-green-600"
              value={form.password}
              onChange={handleChange}
              required={!editId} // required only for new user
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="p-2 rounded bg-black text-green-400 border border-green-600"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 py-2 rounded"
            >
              {editId ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-red-600 hover:bg-red-800 py-2 rounded mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
