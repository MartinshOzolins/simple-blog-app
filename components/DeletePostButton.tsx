"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "../actions/actions";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(deletePost, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="post_id" value={postId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-sm sm:text-base text-red-600 hover:text-red-700 underline  disabled:opacity-50 hover:cursor-pointer"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}
