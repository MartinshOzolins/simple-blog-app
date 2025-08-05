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
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } else if (state?.status === "failure") {
      setTitle("");
      setContent("");
      setCategories("");
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto mt-10 flex flex-col items-center">
      {state?.status === "success" && (
        <p className="mb-4 text-green-600 font-large">{state.message}</p>
      )}
      {state?.status === "failure" && (
        <p className="mb-4 text-green-600 font-large">{state.message}</p>
      )}

      <form action={formAction}>
        <input
          name="title"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          required
        />

        <textarea
          name="content"
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 min-h-[150px]"
          required
        />

        <input
          name="categories"
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
