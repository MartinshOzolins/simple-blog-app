"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "../types";
import Link from "next/link";

export default function PostGrid({ posts }: { posts: Post[] }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (category) params.set("category", category);

      router.push(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, category, router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <input
          placeholder="Search title/content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 border border-gray-300 px-3 py-2 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-60 border border-gray-300 px-3 py-2 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* post cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all bg-white"
              href={`/posts/${post.id}`}
            >
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {post?.name} {post?.surname}
              </p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {post.content.slice(0, 120)}...
              </p>
              {post.categories && (
                <p className="text-xs text-gray-500 italic">
                  Categories: {post.categories}
                </p>
              )}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full col-span-full">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
}
