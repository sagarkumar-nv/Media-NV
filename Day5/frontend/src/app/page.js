export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[380px] text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Task Management App
        </h1>

        <p className="text-gray-600 mb-6">
          Login to manage your tasks securely
        </p>

        <a
          href="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Go to Login
        </a>
      </div>
    </main>
  );
}
