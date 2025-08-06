import { createClient } from "../../config/supabaseServerClient";
import PostGrid from "../../components/PostsGrid";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const srcParams = await searchParams;

  const search = srcParams?.search || "";
  const category = srcParams?.category || "";

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    .ilike("categories", `%${category}%`);

  return <PostGrid posts={posts || []} />;
}
