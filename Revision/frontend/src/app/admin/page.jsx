"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/Axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ================= ADMIN DASHBOARD ================= */
export default function AdminPage() {
  const { logout } = useAuth();

  const [view, setView] = useState("OVERVIEW");
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const data = res.data?.data || [];
      setUsers(data);
      setStudents(data.filter((u) => u.role === "STUDENT"));
      setTeachers(data.filter((u) => u.role === "TEACHER"));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // fetch profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      const profileData = res.data?.data || res.data || {};
      setAdminProfile(profileData);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchProfile()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading)
    return <p className="p-10 text-emerald-400">Loading admin dashboard...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-zinc-900 text-emerald-300 flex">
      {/* SIDEBAR */}
      <aside className="w-64 fixed inset-y-0 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-10 text-center">ADMIN</h2>
        {[
          "OVERVIEW",
          "STUDENTS",
          "TEACHERS",
          "CLASSES",
          "PROFILE",
        ].map((v) => (
          <SidebarButton
            key={v}
            label={v}
            active={view === v}
            onClick={() => setView(v)}
          />
        ))}
      </aside>

      {/* HEADER */}
      <header className="fixed left-64 right-0 top-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-10 z-50">
        <div>
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold">{adminProfile?.name}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-black rounded-lg font-semibold"
        >
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 ml-64 pt-24 px-10 pb-10">
        {view === "OVERVIEW" && <Overview students={students} teachers={teachers} />}
        {view === "STUDENTS" && (
          <UserSection
            title="Students"
            users={students}
            role="STUDENT"
            refresh={fetchUsers}
          />
        )}
        {view === "TEACHERS" && (
          <UserSection
            title="Teachers"
            users={teachers}
            role="TEACHER"
            refresh={fetchUsers}
          />
        )}
        {view === "CLASSES" && (
          <ClassesSection refresh={fetchUsers} />
        )}
        {view === "PROFILE" && <AdminProfile profile={adminProfile} refresh={fetchProfile} />}
      </main>
    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */
function SidebarButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 mb-3 rounded-xl font-semibold transition
        ${active ? "bg-emerald-500 text-black" : "bg-white/10 hover:bg-white/20"}`}
    >
      {label}
    </button>
  );
}

/* ================= OVERVIEW GRAPH ================= */
function Overview({ students, teachers }) {
  const data = [
    { name: "Students", value: students.length, color: "#a855f7" },
    { name: "Teachers", value: teachers.length, color: "#38bdf8" },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center">Dashboard</h1>
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={120}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

/* ================= USER SECTION ================= */
function UserSection({ title, users, role, refresh }) {
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(
    () =>
      users.filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search, users]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-semibold"
        >
          Add {role}
        </button>
      </div>

      <input
        placeholder={`Search ${title.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 rounded-xl bg-black/40 border border-white/10"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-white/5 p-6 rounded-2xl border border-white/10 relative"
          >
            <h2 className="font-bold text-emerald-300">{u.name}</h2>
            <p className="text-gray-300">{u.email}</p>
            <span className="text-xs mt-2 inline-block bg-emerald-500 text-black px-3 py-1 rounded-full">
              {u.role}
            </span>

            <button
              onClick={() => setEditingUser(u)}
              className="absolute top-4 right-4 text-xs bg-yellow-400 text-black px-3 py-1 rounded-lg font-semibold"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          refresh={refresh}
        />
      )}

      {showCreate && (
        <CreateUserModal
          role={role}
          onClose={() => setShowCreate(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
}

/* ================= EDIT USER MODAL ================= */
function EditUserModal({ user, onClose, refresh }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!confirm("Update user?")) return;
    setLoading(true);
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: form.role });
      alert("User updated successfully ✅");
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
      />
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="w-full mb-6 p-3 rounded-xl bg-black/40 border border-white/10"
      >
        <option>STUDENT</option>
        <option>TEACHER</option>
        <option>ADMIN</option>
      </select>

      <div className="flex gap-4">
        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 bg-emerald-500 text-black py-2 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-red-600 text-black py-2 rounded-xl font-semibold"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

/* ================= CREATE USER MODAL ================= */
function CreateUserModal({ role, onClose, refresh }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/users", { ...form, role });
      alert(`${role} created successfully ✅`);
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">Add {role}</h2>
      {["name", "email", "password"].map((f) => (
        <input
          key={f}
          placeholder={f}
          type={f === "password" ? "password" : "text"}
          value={form[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
        />
      ))}
      <button
        onClick={submit}
        className="w-full py-3 bg-emerald-500 text-black rounded-xl font-bold"
      >
        {loading ? "Creating..." : `Create ${role}`}
      </button>
    </Modal>
  );
}

/* ================= CLASSES SECTION ================= */
function ClassesSection({ refresh }) {
  const [className, setClassName] = useState("");
  const [classList, setClassList] = useState([]);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/admin/users"); // replace with /admin/classes endpoint if exists
      setClassList(res.data?.data || []);
    } catch (err) {
      console.error("Fetch classes failed", err);
    }
  };

  const createClass = async () => {
    if (!className) return alert("Enter class name");
    try {
      await api.post("/admin/classes", { name: className });
      alert("Class created ✅");
      setClassName("");
      fetchClasses();
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create class ❌");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Classes</h1>
      <div className="flex mb-6 gap-4">
        <input
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="p-3 rounded-xl bg-black/40 border border-white/10 flex-1"
        />
        <button
          onClick={createClass}
          className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-semibold"
        >
          Create Class
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classList.map((c) => (
          <div
            key={c.id}
            className="bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <h2 className="font-bold text-emerald-300">{c.name}</h2>
            <p className="text-gray-300">
              Teacher: {c.teacher?.user?.name || "Unassigned"}
            </p>
            <p className="text-gray-300">
              Students: {c.students?.length || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= ADMIN PROFILE ================= */
function AdminProfile({ profile, refresh }) {
  const [editing, setEditing] = useState(false);

  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

      <ProfileRow label="Name" value={profile.name} />
      <ProfileRow label="Email" value={profile.email} />
      <ProfileRow label="Role" value={profile.role} />
      <ProfileRow
        label="Joined"
        value={new Date(profile.createdAt).toLocaleString()}
      />

      <button
        onClick={() => setEditing(true)}
        className="w-full mt-6 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:scale-105 transition"
      >
        Edit Profile
      </button>

      {editing && (
        <EditAdminModal
          profile={profile}
          onClose={() => setEditing(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
}

/* ================= MODALS ================= */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-white/10">
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 font-bold text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function EditAdminModal({ profile, onClose, refresh }) {
  const [form, setForm] = useState({ ...profile, password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!confirm("Update profile?")) return;
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await api.patch("/user/me", payload);
      alert("Profile updated ✅");
      refresh && refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
      />
      <input
        type="password"
        value={form.password}
        placeholder="Leave blank to keep password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
      />
      <div className="flex gap-4">
        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 bg-emerald-500 text-black py-2 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-red-600 text-black py-2 rounded-xl font-semibold"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between mb-4 text-gray-300">
      <span>{label}</span>
      <span className="font-semibold text-emerald-300">{value}</span>
    </div>
  );
}
