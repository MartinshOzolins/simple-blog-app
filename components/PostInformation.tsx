import { User } from "@supabase/supabase-js";
import { Comment } from "../types";
import AddNewCommentForm from "./AddNewCommentForm";

export default function PostInformation({
  postId,
  title,
  content,
  categories,
  name,
  surname,
  comments,
  user,
}: {
  postId: number;
  title: string;
  content: string;
  categories?: string;
  name?: string;
  surname?: string;
  comments: Comment[];
  user: User | null;
}) {
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      {/* post info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <p className="text-sm text-gray-500 mb-1">
          By {name} {surname}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-800 whitespace-pre-line mb-4">{content}</p>
        {categories && (
          <p className="text-sm text-gray-500 italic">
            Categories: {categories}
          </p>
        )}
      </div>
      {/* create comment form */}
      <AddNewCommentForm postId={postId} />
      {/* comments */}
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-2">
                <p className="text-sm text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {comment.name} {comment.surname}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
