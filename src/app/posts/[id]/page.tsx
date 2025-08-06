import { createClient } from "../../../../config/supabaseServerClient";
import { redirect } from "next/navigation";
import { Post } from "../../../../types";
import PostInformation from "../../../../components/PostInformation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single<Post>();

  if (fetchError || !post) {
    redirect("/");
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Post Details</h1>

      <PostInformation
        postId={post.id}
        title={post.title}
        content={post.content}
        categories={post.categories}
        name={post.name}
        surname={post.surname}
        comments={comments || []}
        user={user}
      />
    </div>
  );
}
