"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Comment } from "../types";
import AddNewCommentForm from "./AddNewCommentForm";
import { deleteComment, editComment } from "../actions/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostInformation({
  postId,
  title,
  content,
  categories,
  authorId,
  createdAt,
  name,
  surname,
  comments,
  user,
}: {
  postId: number;
  title: string;
  content: string;
  categories?: string;
  authorId: string;
  createdAt: string;
  name?: string;
  surname?: string;
  comments: Comment[];
  user: User | null;
}) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const router = useRouter();

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleSaveEdit = async (commentId: number) => {
    const result = await editComment(commentId, editedContent);
    if (result.status === "success") {
      setEditingCommentId(null);
      setEditedContent("");
      router.refresh();
    }
  };

  const handleDelete = async (commentId: number) => {
    const result = await deleteComment(commentId);
    if (result.status === "success") {
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* post info */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <p className="text-sm text-gray-500 mb-1">
          By {name} {surname}
        </p>
        <p className="text-xs text-gray-400 mb-1">
          {new Date(createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 break-words">
          {title}
        </h1>
        <p className="text-gray-800 whitespace-pre-line mb-4">{content}</p>
        {categories && (
          <p className="text-sm text-gray-500 italic">
            Categories: {categories}
          </p>
        )}

        {user?.id === authorId && (
          <div className="mt-4">
            <Link
              href={`/posts/edit/${postId}`}
              className="text-sm text-gray-700 underline hover:text-gray-900"
            >
              Edit
            </Link>
          </div>
        )}
      </div>

      {/* add new comment form */}
      <AddNewCommentForm postId={postId} />

      {/* comments section */}
      <div className="bg-gray-50 rounded-lg shadow border border-gray-200 p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-2">
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1 mb-2 text-sm"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-sm text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-800 hover:cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-sm text-gray-600 border px-2 py-1 rounded hover:bg-gray-100 hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700 flex-1">
                        {comment.content}
                      </p>

                      {user?.id === comment.author_id && (
                        <div className="flex gap-2 ml-4 mt-1 pr-2">
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="text-xs text-gray-700 underline hover:text-gray-900 hover:cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-xs text-red-600 underline hover:text-red-700 hover:cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mb-1">
                      By {comment.name} {comment.surname}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
