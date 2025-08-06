import EditPostForm from "../../../../../components/EditPostForm";
import { createClient } from "../../../../../config/supabaseServerClient";
import { redirect } from "next/navigation";
import { Post } from "../../../../../types";

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

  if (!user) {
    redirect("/sign-up");
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .single<Post>();

  // user doesn't own this post
  if (fetchError || !post) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit your post</h1>

      {/* client side component that handles inputs and sends formData to server action once submitted*/}
      <EditPostForm
        postId={id}
        title={post?.title}
        content={post?.content}
        categories={post?.categories}
      />
    </div>
  );
}
