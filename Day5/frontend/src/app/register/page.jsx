"use client";

import React, { useState, useContext } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(formData);
            setFormData({
                username: "",
                password: ""
            });
            router.push('/login');
        } catch (error) {
            console.error("Registration error", error);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-xl shadow-xl w-[380px]">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder='Enter User Name' 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder='Enter Password' 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-semibold mb-4"
                    >
                        Register
                    </button>
                </form>

                <p className="text-gray-600 text-center mb-2">Already have an account?</p>
                <Link 
                    href="/login"
                    className="block text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold"
                >
                    Login
                </Link>
            </div>
        </main>
    )
}
