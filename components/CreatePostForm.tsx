"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../actions/actions";

export default function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      setTitle("");
      setContent("");
      setCategories("");
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {state?.status === "success" && (
        <p className="mb-4 text-green-600 font-medium">{state.message}</p>
      )}
      {state?.status === "failure" && (
        <p className="mb-4 text-red-600 font-medium">{state.message}</p>
      )}

      <form
        action={formAction}
        className="bg-white shadow border border-gray-200 p-6 rounded"
      >
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          required
        />

        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 min-h-[150px]"
          required
        />

        <label
          htmlFor="categories"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Categories
        </label>
        <input
          id="categories"
          name="categories"
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
        />

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={isPending}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 hover:cursor-pointer"
          >
            {isPending ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
