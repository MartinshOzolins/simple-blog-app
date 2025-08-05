"use server";

import validator from "validator";
import { createClient } from "../config/supabaseServerClient";

export async function createPost(
  currState: { status: string; message: string } | null,
  formData: FormData
) {
  const title = formData.get("title");
  const content = formData.get("content");
  const categories = formData.get("categories");

  if (!title || !content || !categories)
    return {
      status: "failure",
      message: "Please complete all input fields.",
    };

  // sanitize user inputs
  const sanitizedTitle = validator.escape(String(title)).trim();
  const sanitizedContent = validator.escape(String(content)).trim();
  const sanitizedCategories = validator.escape(String(categories)).trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "failure",
      message: "You must be logged in to create a post.",
    };
  }

  // Insert into the "posts" table
  const { error } = await supabase.from("posts").insert({
    title: sanitizedTitle,
    content: sanitizedContent,
    categories: sanitizedCategories,
    author_id: user.id,
  });

  if (error) {
    console.error("Insert error:", error.message);
    return {
      status: "failure",
      message: "Failed to publish the post.",
    };
  }

  return {
    status: "success",
    message: "The post has been successfully published.",
  };
}

export async function editPost(
  currState: { status: string; message: string } | null,
  formData: FormData
) {
  const title = formData.get("title");
  const content = formData.get("content");
  const categories = formData.get("categories");
  const postId = formData.get("post_id");

  if (!title || !content || !categories || !postId) {
    return {
      status: "failure",
      message: "Please complete all input fields.",
    };
  }

  const sanitizedTitle = validator.escape(String(title)).trim();
  const sanitizedContent = validator.escape(String(content)).trim();
  const sanitizedCategories = validator.escape(String(categories)).trim();
  const sanitizedPostId = String(postId);

  // retrieves current user
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "failure",
      message: "You must be logged in to edit a post.",
    };
  }

  // checks if user owns post or if it exists
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", sanitizedPostId)
    .eq("author_id", user.id)
    .single();

  if (fetchError || !post) {
    return {
      status: "failure",
      message: "Post not found or you don't have permission to edit it.",
    };
  }

  // updates the user's post with the new data
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      title: sanitizedTitle,
      content: sanitizedContent,
      categories: sanitizedCategories,
    })
    .eq("id", sanitizedPostId);

  if (updateError) {
    return {
      status: "failure",
      message: "Failed to update the post.",
    };
  }

  return {
    status: "success",
    message: "The post has been successfully updated.",
  };
}
