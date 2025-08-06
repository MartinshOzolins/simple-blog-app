export type Post = {
  id: number;
  title: string;
  content: string;
  categories?: string;
  author_id: string;
  created_at: string;
  name?: string;
  surname?: string;
};

export type Comment = {
  id: number;
  post_id: string;
  author_id: string;
  name: string;
  surname: string;
  content: string;
  created_at: string;
};
