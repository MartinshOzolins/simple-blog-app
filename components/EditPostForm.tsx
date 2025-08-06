"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { editPost } from "../actions/actions";

export default function EditPostForm({
  postId,
  title,
  content,
  categories,
}: {
  postId: string;
  title: string;
  content: string;
  categories?: string;
}) {
  const [state, formAction, isPending] = useActionState(editPost, null);

  // input states
  const [postTitle, setPostTitle] = useState(title);
  const [postContent, setPostContent] = useState(content);
  const [postCategories, setPostCategories] = useState(categories);

  const router = useRouter();
  useEffect(() => {
    if (state?.status === "success") {
      setPostTitle("");
      setPostTitle("");
      setPostTitle("");
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } else if (state?.status === "failure") {
      setPostTitle("");
      setPostTitle("");
      setPostTitle("");
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
        <input hidden type="text" defaultValue={postId} name="post_id" />
        <input
          name="title"
          type="text"
          placeholder="Post Title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          required
        />

        <textarea
          name="content"
          placeholder="Post Content"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 min-h-[150px]"
          required
        />

        <input
          name="categories"
          type="text"
          placeholder="Categories (comma separated)"
          value={postCategories}
          onChange={(e) => setPostCategories(e.target.value)}
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
