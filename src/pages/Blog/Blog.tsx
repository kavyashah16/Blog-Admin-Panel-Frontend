// pages/Blog/Blog.tsx
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router";

// Types (you can move these to a types file later)
interface Tag {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  topic: string;
  tags: Tag[];
  slug: string;
}

const Blog: FC = () => {
  const navigate = useNavigate();

  // TODO: Replace with real data fetching (useEffect + API call)
  const [posts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Getting Started with Tailwind CSS",
      excerpt:
        "Learn how to set up Tailwind in your React project and start building beautiful UIs quickly...",
      featuredImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      topic: "Styling",
      tags: [
        { id: "t1", name: "tailwind" },
        { id: "t2", name: "css" },
        { id: "t3", name: "frontend" },
      ],
      slug: "getting-started-tailwind",
    },
    {
      id: "2",
      title: "React Router v6 Best Practices",
      excerpt:
        "How to structure routes, handle nested layouts, data loading and more in modern React apps...",
      featuredImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      topic: "Routing",
      tags: [
        { id: "t4", name: "react-router" },
        { id: "t5", name: "navigation" },
      ],
      slug: "react-router-v6-best-practices",
    },
    // Add more mock posts or fetch from API
  ]);

  const handleView = (slug: string) => {
    // Assuming your public blog post lives at /blog/slug
    window.open(`/blog/${slug}`, "_blank");
  };

  const handleEdit = (id: string) => {
    navigate(`/blogedit/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      // TODO: Call your delete API here
      console.log("Deleting post:", id);
      // After success: update local state or refetch
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          to="/blogedit/new" // or wherever your create-new-post route is
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-lg">No blog posts yet.</p>
          <p>Click "New Post" to create your first article!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-gray-300"
            >
              {/* Image + Topic */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1516321310762-3698944766f4?w=800&auto=format&fit=crop&q=60";
                  }}
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {post.topic}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {post.title}
                </h2>

                <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => handleView(post.slug)}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(post.id)}
                    className="flex-1 rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="flex-1 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
