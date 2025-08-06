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

  const [postTitle, setPostTitle] = useState(title);
  const [postContent, setPostContent] = useState(content);
  const [postCategories, setPostCategories] = useState(categories);

  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      setPostCategories("");
      setPostTitle("");
      setPostContent("");
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {state?.status === "failure" && (
        <p className="mb-4 text-red-600 font-medium">{state.message}</p>
      )}

      <form
        action={formAction}
        className="bg-white shadow border border-gray-200 p-6 rounded"
      >
        <input hidden type="text" defaultValue={postId} name="post_id" />

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
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
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
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
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
          value={postCategories}
          onChange={(e) => setPostCategories(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
        />

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={isPending}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 hover:cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
