import { createClient } from "../../config/supabaseServerClient";
import PostGrid from "../../components/PostsGrid";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // retrieves supabase client
  const supabase = await createClient();

  const srcParams = await searchParams;

  // retrieves url search query params
  const search = srcParams?.search || "";
  const category = srcParams?.category || "";

  // fetches posts from database
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    .ilike("categories", `%${category}%`);

  // passes posts to client side component
  return <PostGrid posts={posts || []} />;
}
