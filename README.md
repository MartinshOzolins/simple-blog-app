# SimpleBlog

SimpleBlog is a minimal blog application where users can register, log in, write posts, and comment on others' posts.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/simple-blog.git
cd simple-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Go to [https://supabase.com](https://supabase.com) and create a new project
- Enable **email/password authentication**
- Create the required `posts` and `comments` tables
- Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 4. Configure environment variables

Create a `.env.local` file in the root folder based on the provided `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
