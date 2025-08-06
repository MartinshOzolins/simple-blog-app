"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { addNewComment } from "../actions/actions";

export default function AddNewCommentForm({ postId }: { postId: number }) {
  const [state, formAction, isPending] = useActionState(addNewComment, null);
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      setContent("");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mb-4 ">
      {state?.status === "failure" && (
        <p className="text-sm text-red-600 mt-2">{state.message}</p>
      )}
      {state?.status === "success" && (
        <p className="text-sm text-green-600 mt-2">{state.message}</p>
      )}
      <input type="hidden" name="post_id" value={postId} />

      <input
        name="content"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        required
        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
        disabled={isPending}
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 hover:cursor-pointer"
      >
        {isPending ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
