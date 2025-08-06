"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "../../../../config/supabaseBrowserClient";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    setEmail("");
    setPassword("");
    setName("");
    setSurname("");
    const { error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
      options: {
        data: { name, surname },
      },
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
            setErrorMsg("Too many attempts. Please wait and try again.");
            break;
          default:
            setErrorMsg("Something went wrong. Please try again.");
            break;
        }
      }
    } else {
      setMessage(
        "Registration was successful. Please confirm your email before logging in."
      );
      await supabaseBrowserClient.auth.signOut();
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign Up</h1>
      {message && (
        <div className="mb-5 flex flex-col justify-center space-y-2">
          <p className="text-center text-sm text-green-600">{message}</p>
          <Link
            href="/auth/sign-in"
            className="mx-auto rounded bg-gray-600 px-2 py-1 text-white hover:bg-gray-700 hover:cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      )}
      {errorMsg && (
        <p className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
      )}
      <form onSubmit={handleSignUp}>
        <label htmlFor="name">First Name</label>
        <input
          id="name"
          type="text"
          className="mb-4 w-full rounded border border-gray-300 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="surname">Last Name</label>
        <input
          id="surname"
          type="text"
          className="mb-4 w-full rounded border border-gray-300 p-2"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

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
          type="submit"
          className="w-full rounded bg-gray-600 p-2 text-white hover:bg-gray-700 hover:cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
