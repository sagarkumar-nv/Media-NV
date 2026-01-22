"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* ================= TEACHER PAGE ================= */
export default function TeacherPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("OVERVIEW");
  const [editingUser, setEditingUser] = useState(null);

  // Redirect non-teacher
  useEffect(() => {
    if (!user) return;
    if (user.role !== "TEACHER") router.push("/login");
  }, [user]);

  // Fetch all users & profile
  const fetchData = async () => {
    try {
      const resUsers = await api.get("/user/all"); // students + teachers (no admins editable)
      const resProfile = await api.get("/user/me"); // teacher profile

      const allUsers = resUsers.data?.data || [];
      setUsers(allUsers);
      setStudents(allUsers.filter(u => u.role === "STUDENT"));
      setTeacherProfile(resProfile.data?.data ?? resProfile.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-10 text-emerald-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-zinc-900 text-emerald-300 flex">

      {/* SIDEBAR */}
      <aside className="w-64 fixed inset-y-0 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-10 text-center">TEACHER</h2>
        {["OVERVIEW","STUDENTS","USERS","PROFILE"].map(v => (
          <SidebarButton key={v} label={v} active={view===v} onClick={() => setView(v)} />
        ))}
      </aside>

      {/* HEADER */}
      <header className="fixed left-64 right-0 top-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-10 z-50">
        <div>
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold">{teacherProfile?.name}</p>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-black rounded-lg font-semibold">Logout</button>
      </header>

      {/* MAIN */}
      <main className="flex-1 ml-64 pt-24 px-10 pb-10">
        {view==="OVERVIEW" && <Overview students={students} teachers={users.filter(u=>u.role==="TEACHER")} />}
        {view==="STUDENTS" && <UserGrid title="Students" data={students} refresh={fetchData} setEditingUser={setEditingUser} />}
        {view==="USERS" && <UserGrid title="All Users" data={users} refresh={fetchData} setEditingUser={setEditingUser} />}
        {view==="PROFILE" && <TeacherProfile profile={teacherProfile} refresh={fetchData} />}
        {editingUser && <EditUserModal user={editingUser} onClose={()=>setEditingUser(null)} refresh={fetchData} />}
      </main>
    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */
function SidebarButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 mb-3 rounded-xl font-semibold transition ${active ? "bg-emerald-500 text-black" : "bg-white/10 hover:bg-white/20"}`}
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
              {data.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

/* ================= USER GRID ================= */
function UserGrid({ title, data, refresh, setEditingUser }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(()=>data.filter(u=>`${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())), [search, data]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <input
        className="mb-6 w-full p-3 rounded-xl bg-black/40 border border-white/10"
        placeholder="Search..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(u=>(
          <div key={u.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 relative">
            <h2 className="font-bold text-emerald-300">{u.name}</h2>
            <p className="text-gray-300">{u.email}</p>
            <span className="text-xs mt-2 inline-block bg-emerald-500 text-black px-3 py-1 rounded-full">{u.role}</span>

            {u.role==="STUDENT" && (
              <button
                onClick={()=>setEditingUser(u)}
                className="absolute top-4 right-4 text-xs bg-yellow-400 text-black px-3 py-1 rounded-lg font-semibold"
              >Edit</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= EDIT MODAL ================= */
function EditUserModal({ user, onClose, refresh }) {
  const [form, setForm] = useState({name:user.name,email:user.email,role:user.role});
  const [loading, setLoading] = useState(false);

  const submit = async()=>{
    if(!confirm("Update this student?")) return;
    setLoading(true);
    try{
      await api.patch(`/user/student/${user.id}`, form);
      alert("Student updated ✅");
      refresh();
      onClose();
    }catch(err){
      alert(err.response?.data?.message || "Update failed ❌");
    }finally{setLoading(false);}
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Student</h2>
        {["name","email","role"].map(f=>(
          <input
            key={f}
            value={form[f]}
            onChange={e=>setForm({...form,[f]:e.target.value})}
            className="w-full mb-4 p-3 rounded-xl bg-black/40 border border-white/10"
          />
        ))}
        <div className="flex gap-4">
          <button onClick={submit} disabled={loading} className="flex-1 bg-emerald-500 text-black py-2 rounded-xl font-semibold">{loading?"Saving...":"Save"}</button>
          <button onClick={onClose} className="flex-1 bg-red-600 text-black py-2 rounded-xl font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ================= TEACHER PROFILE ================= */
function TeacherProfile({ profile, refresh }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    password: "",
    role: profile?.role || "TEACHER"
  });
  const [loading, setLoading] = useState(false);

  const updateProfile = async ()=>{
    if(!confirm("Update your profile?")) return;
    setLoading(true);
    try{
      await api.patch("/user/me", form);
      alert("Profile updated ✅");
      refresh();
    }catch(err){
      alert(err.response?.data?.message || "Update failed ❌");
    }finally{setLoading(false);}
  };

  return (
    <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>
      {["name","email","password","role"].map(f=>(
        <div key={f} className="mb-4">
          <label className="text-sm text-gray-400">{f}</label>
          <input
            type={f==="password"?"password":"text"}
            value={form[f]}
            onChange={e=>setForm({...form,[f]:e.target.value})}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
          />
        </div>
      ))}
      <button onClick={updateProfile} disabled={loading} className="w-full mt-6 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:scale-105 transition">{loading?"Saving...":"Update Profile"}</button>
    </div>
  );
}
