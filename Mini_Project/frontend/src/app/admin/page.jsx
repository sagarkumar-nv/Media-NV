"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/* ================= ADMIN PAGE ================= */
export default function AdminPage() {
  const { logout } = useAuth();

  const [view, setView] = useState("OVERVIEW");
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await api.get("/user");
    const data = res.data?.data || [];
    setUsers(data);
    setStudents(data.filter(u => u.role === "STUDENT"));
    setTeachers(data.filter(u => u.role === "TEACHER"));
  };

  const fetchProfile = async () => {
    const res = await api.get("/user/me");
    setAdminProfile(res.data?.data ?? res.data);
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchProfile()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <p className="p-10 text-emerald-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-zinc-900 text-emerald-300 flex">

      {/* SIDEBAR */}
      <aside className="w-64 fixed inset-y-0 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-10 text-center">ADMIN</h2>

        {["OVERVIEW","STUDENTS","TEACHERS","ADD_STUDENT","ADD_TEACHER","PROFILE","ADMINS"].map(v => (
          <SidebarButton
            key={v}
            label={v.replace("_"," ")}
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
        {view === "STUDENTS" && <UserGrid title="Students" data={students} refresh={fetchUsers} />}
        {view === "TEACHERS" && <UserGrid title="Teachers" data={teachers} refresh={fetchUsers} />}
        {view === "ADD_STUDENT" && <UserForm role="STUDENT" refresh={fetchUsers} />}
        {view === "ADD_TEACHER" && <UserForm role="TEACHER" refresh={fetchUsers} />}
        {view === "PROFILE" && <AdminProfile profile={adminProfile} />}
        {view === "ADMINS" && <AdminsSection users={users} />}
      </main>
    </div>
  );
}

/* ================= SIDEBAR ================= */
function SidebarButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 mb-3 rounded-xl font-semibold transition
        ${active ? "bg-emerald-500 text-black" : "bg-white/10 hover:bg-white/20"}
      `}
    >
      {label}
    </button>
  );
}

/* ================= OVERVIEW ================= */
function Overview({ students, teachers }) {
  const data = [
    { name: "Students", value: students.length, color: "#a855f7" },
    { name: "Teachers", value: teachers.length, color: "#38bdf8" }
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center">Dashboard</h1>
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={120}>
              {data.map((d,i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

/* ================= USER GRID + EDIT ================= */
function UserGrid({ title, data, refresh }) {
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const filtered = useMemo(() =>
    data.filter(u =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    ), [search, data]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <input
        className="mb-6 w-full p-3 rounded-xl bg-black/40 border border-white/10"
        placeholder="Search user..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(u => (
          <div key={u.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 relative">
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
    </>
  );
}

/* ================= EDIT MODAL ================= */
function EditUserModal({ user, onClose, refresh }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!confirm("Are you sure you want to update this user?")) return;
    setLoading(true);
    try {
      await api.patch(`/user/${user.id}`, form);
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>

        {["name","email"].map(f => (
          <input
            key={f}
            value={form[f]}
            onChange={e => setForm({ ...form, [f]: e.target.value })}
            className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
          />
        ))}

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
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
      </div>
    </div>
  );
}

/* ================= USER FORM ================= */
function UserForm({ role, refresh }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  const submit = async e => {
    e.preventDefault();
    await api.post("/user/admin-create", { ...form, role });
    alert(`${role} created`);
    refresh();
    setForm({ name:"", email:"", password:"" });
  };

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto mt-10 space-y-4">
      <h1 className="text-3xl text-center">Add {role}</h1>
      {Object.keys(form).map(f => (
        <input
          key={f}
          placeholder={f}
          type={f === "password" ? "password" : "text"}
          value={form[f]}
          onChange={e => setForm({ ...form, [f]: e.target.value })}
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
        />
      ))}
      <button className="w-full py-3 bg-emerald-500 text-black rounded-xl font-bold">
        Create
      </button>
    </form>
  );
}

/* ================= PROFILE ================= */
function AdminProfile({ profile, refresh }) {
  const [editing, setEditing] = useState(false);

  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

      {/* Display profile info */}
      <ProfileRow label="Name" value={profile.name} />
      <ProfileRow label="Email" value={profile.email} />
      <ProfileRow label="Role" value={profile.role} />
      <ProfileRow
        label="Joined"
        value={new Date(profile.createdAt).toLocaleString()}
      />

      {/* Edit button */}
      <button
        onClick={() => setEditing(true)}
        className="w-full mt-6 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:scale-105 transition"
      >
        Edit Profile
      </button>

      {/* Edit Modal */}
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

/* ================= EDIT MODAL FOR ADMIN ================= */
function EditAdminModal({ profile, onClose, refresh }) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    password: "",       // optional, leave blank if no change
    role: profile.role, // admin can change role
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!confirm("Are you sure you want to update your profile?")) return;
    setLoading(true);
    try {
      // Only send password if not empty
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      await api.patch("/user/me", payload);
      alert("Profile updated successfully ✅");
      refresh && refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <label className="text-sm text-gray-400">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
        />

        <label className="text-sm text-gray-400">Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
        />

        <label className="text-sm text-gray-400">Password (leave blank to keep)</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
        />

        <label className="text-sm text-gray-400">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full mb-6 p-3 rounded-xl bg-black/40 border border-white/10"
        >
          <option>ADMIN</option>
          <option>STUDENT</option>
          <option>TEACHER</option>
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
      </div>
    </div>
  );
}

/* ================= PROFILE ROW ================= */
function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-white/10">
      <span className="text-gray-400 capitalize">{label}</span>
      <span className="text-emerald-300">{value}</span>
    </div>
  );
}


/* ================= ADMINS ================= */
function AdminsSection({ users }) {
  const admins = users.filter(u => u.role === "ADMIN");

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {admins.map(a => (
        <div key={a.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <h2 className="font-bold text-emerald-300">{a.name}</h2>
          <p className="text-gray-300">{a.email}</p>
        </div>
      ))}
    </div>
  );
}

