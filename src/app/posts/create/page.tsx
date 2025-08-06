import { createClient } from "../../../../config/supabaseServerClient";
import { redirect } from "next/navigation";
import CreatePostForm from "../../../../components/CreatePostForm";

export default async function CreatePostPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Create post</h1>

      {/* Client side component that handles inputs and sends formData to server action once submitted*/}
      <CreatePostForm />
    </div>
  );
}
