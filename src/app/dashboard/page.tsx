import { createClient } from "../../../config/supabaseServerClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
