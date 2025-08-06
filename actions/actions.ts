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

  if (!title || !content || !categories) {
    return {
      status: "failure",
      message: "Please complete all input fields.",
    };
  }

  const sanitizedTitle = validator.trim(String(title));
  const sanitizedContent = validator.trim(String(content));
  const sanitizedCategories = validator.trim(String(categories));

  if (!validator.isLength(sanitizedTitle, { min: 3, max: 150 })) {
    return {
      status: "failure",
      message: "Title must be between 3 and 150 characters.",
    };
  }

  if (!validator.isLength(sanitizedContent, { min: 10 })) {
    return {
      status: "failure",
      message: "Content must be at least 10 characters.",
    };
  }

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

  const { name = "", surname = "" } = user.user_metadata ?? {};

  const { error } = await supabase.from("posts").insert({
    title: sanitizedTitle,
    content: sanitizedContent,
    categories: sanitizedCategories,
    author_id: user.id,
    name,
    surname,
  });

  if (error) {
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

  // retrieves supabase client
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

export async function addNewComment(
  currState: { status: string; message: string } | null,
  formData: FormData
) {
  const content = formData.get("content");
  const postId = formData.get("post_id");

  if (!content) {
    return {
      status: "failure",
      message: "Please complete all input fields.",
    };
  }

  const sanitizedContent = validator.trim(String(content));

  if (!validator.isLength(sanitizedContent, { min: 2, max: 300 })) {
    return {
      status: "failure",
      message: "Content must be at least 2 characters.",
    };
  }

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

  const { name = "", surname = "" } = user.user_metadata ?? {};

  const { error } = await supabase.from("comments").insert({
    content: sanitizedContent,
    post_id: postId,
    author_id: user.id,
    name,
    surname,
  });

  if (error) {
    return {
      status: "failure",
      message: "Failed to add the comment.",
    };
  }

  return {
    status: "success",
    message: "The comment has been successfully added.",
  };
}
