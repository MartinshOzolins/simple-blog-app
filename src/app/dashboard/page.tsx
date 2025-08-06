import { createClient } from "../../../config/supabaseServerClient";
import Link from "next/link";
import DeletePostButton from "../../../components/DeletePostButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-700 text-base sm:text-lg">
        You are not logged in.
      </div>
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        Your posts
      </h1>

      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 break-words">
                {post.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 break-words">
                {post.content.slice(0, 100)}...
              </p>

              <div className="flex gap-4 items-center">
                <Link
                  href={`/posts/edit/${post.id}`}
                  className="text-sm sm:text-base text-gray-700 underline hover:text-gray-900"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center mt-12">
          <p className="text-gray-600 mb-2 text-base sm:text-lg">
            You have not written any posts yet.
          </p>
          <Link
            href="/posts/create"
            className="text-sm sm:text-base text-gray-700 underline hover:text-gray-900"
          >
            Add your first post
          </Link>
        </div>
      )}
    </div>
  );
}
