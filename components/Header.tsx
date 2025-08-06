"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "../config/supabaseBrowserClient";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const result = await supabaseBrowserClient.auth.getUser();
      setUser(result.data.user ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const listener = supabaseBrowserClient.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
          case "USER_UPDATED":
            setUser(session?.user ?? null);
            break;
          case "SIGNED_OUT":
            setUser(null);
            break;
        }
      }
    );

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabaseBrowserClient.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-16 flex items-center justify-between pr-1">
        <Link
          href="/"
          className="font-semibold text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
        >
          SimpleBlog
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 text-sm md:text-base font-medium text-gray-700">
          <Link
            href="/"
            className="hover:text-black hover:underline transition hover:cursor-pointer"
          >
            Posts
          </Link>

          <Link
            href="/posts/create"
            className="hover:text-black hover:underline transition hover:cursor-pointer"
          >
            Create
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="hover:text-black hover:underline transition hover:cursor-pointer"
            >
              My posts
            </Link>
          )}

          {!user ? (
            <Link
              href="/auth/sign-in"
              className="hover:text-black hover:underline transition hover:cursor-pointer"
            >
              Sign in
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:underline transition hover:cursor-pointer"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
