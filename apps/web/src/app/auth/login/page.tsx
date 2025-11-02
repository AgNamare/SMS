"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true, // Let NextAuth handle the redirect
        callbackUrl: "/schools",
      });

      // If we get here and there's an error, signIn didn't redirect
      if (result?.error) {
        setError("Invalid credentials");
      }

      // No need to handle success case - NextAuth will redirect automatically
      // No need to log manually - NextAuth events handle logging
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <form
        onSubmit={handleLogin}
        className='p-6 bg-white rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-semibold mb-4'>Login</h2>

        <input
          type='email'
          placeholder='Email'
          className='border w-full p-2 mb-3 rounded'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type='password'
          placeholder='Password'
          className='border w-full p-2 mb-3 rounded'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className='text-red-500 mb-2'>{error}</p>}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400'>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
