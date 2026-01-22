"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* ================= STUDENT PAGE ================= */
export default function StudentPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("OVERVIEW");

  // Redirect non-students
  useEffect(() => {
    if (!user) return;
    if (user.role !== "STUDENT") router.push("/login");
  }, [user]);

  // Fetch all users + own profile
  const fetchData = async () => {
    try {
      const resUsers = await api.get("/user/all"); // all students + teachers
      const resProfile = await api.get("/user/me"); // own profile

      const allUsers = resUsers.data?.data || [];
      setUsers(allUsers);
      setStudents(allUsers.filter(u => u.role === "STUDENT"));
      setStudentProfile(resProfile.data?.data ?? resProfile.data);
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
        <h2 className="text-2xl font-bold mb-10 text-center">STUDENT</h2>
        {["OVERVIEW","USERS","PROFILE"].map(v => (
          <SidebarButton key={v} label={v} active={view===v} onClick={()=>setView(v)} />
        ))}
      </aside>

      {/* HEADER */}
      <header className="fixed left-64 right-0 top-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-10 z-50">
        <div>
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold">{studentProfile?.name}</p>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-black rounded-lg font-semibold">Logout</button>
      </header>

      {/* MAIN */}
      <main className="flex-1 ml-64 pt-24 px-10 pb-10">
        {view==="OVERVIEW" && <Overview students={students} teachers={users.filter(u=>u.role==="TEACHER")} />}
        {view==="USERS" && <UserGrid title="All Users" data={users} />}
        {view==="PROFILE" && <StudentProfile profile={studentProfile} refresh={fetchData} />}
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

/* ================= USER GRID (READONLY) ================= */
function UserGrid({ title, data }) {
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
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= STUDENT PROFILE ================= */
function StudentProfile({ profile, refresh }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    password: "",
    role: profile?.role || "STUDENT"
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
