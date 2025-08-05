"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "../../../config/supabaseBrowserClient";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // logical states
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");

    const { error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("confirm")) {
        setErrorMsg("Please confirm your email before logging in.");
      } else {
        switch (error.code) {
          case "invalid_login_credentials":
          case "invalid_credentials":
          case "user_not_found":
            setErrorMsg("Incorrect email or password.");
            break;
          case "validation_failed":
            setErrorMsg("Please enter a valid email and password.");
            break;
          case "unverified_email":
            setErrorMsg("Please verify your email address to log in.");
            break;
          case "too_many_requests":
            setErrorMsg("Too many login attempts. Please wait and try again.");
            break;
          default:
            setErrorMsg("Something went wrong. Please try again.");
            break;
        }
      }
    } else {
      setMessage(
        "Registration was succesful. Please confirm your email before logging in."
      );
      await supabaseBrowserClient.auth.signOut();
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign Up</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="mb-4 w-full rounded border border-gray-300 p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        className="mb-4 w-full rounded border border-gray-300 p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full rounded bg-gray-600 p-2 text-white hover:bg-gray-700 hover:cursor-pointer"
      >
        Sign In
      </button>

      {errorMsg && (
        <p className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
      )}
      {message && (
        <>
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          <Link href={"/sign-in"}>Sign In</Link>
        </>
      )}
    </div>
  );
}
