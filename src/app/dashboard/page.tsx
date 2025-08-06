import { createClient } from "../../../config/supabaseServerClient";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center">You are not logged in.</div>;
  }

  // Fetch user posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Posts</h1>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {post.content.slice(0, 100)}...
              </p>

              <div className="flex gap-4">
                <Link
                  href={`/posts/edit/${post.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </Link>
                <form method="POST">
                  <button
                    type="submit"
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full itmes-center">
          <p className="text-gray-500">You have not written any posts yet. </p>
          <Link href="/posts/create">Add your first post!</Link>
        </div>
      )}
    </div>
  );
}
