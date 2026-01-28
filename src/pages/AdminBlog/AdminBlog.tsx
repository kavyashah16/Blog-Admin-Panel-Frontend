import { FC, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "../../api/axios";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import Button from "../../components/ui/button/Button";

// Types
interface Category {
  id: number;
  name: string;
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  feature: boolean;
  status: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = "http://localhost:5000";

const AdminBlog: FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });
  const page = Number(searchParams.get("page")) || 1;

  const handlePage = (direction: "prev" | "next") => {
    if (direction === "prev" && page > 1) {
      setSearchParams({ page: String(page - 1) });
    }

    if (direction === "next" && page < totalPages) {
      setSearchParams({ page: String(page + 1) });
    }
  };

  const handleSync = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/blog/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sync Failed");
      }

      alert(data.message || "Blog synced successfully");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const [blogsRes, catsRes] = await Promise.all([
          api.get(`${API_BASE}/blog?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/category"),
        ]);

        setPosts(blogsRes.data.data || []);
        setCategories(catsRes.data.data || []);
        setTotalPages(blogsRes.data.pagination.totalPage);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Session expired. Please sign in again.");
        } else {
          setError("Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat?.name || "Uncategorized";
  };

  const getExcerpt = (html: string) => {
    let text = html.replace(/<[^>]+>/g, "");
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/\s+/g, " ").trim();
    return text.length > 150 ? text.slice(0, 150) + "..." : text;
  };

  const handleView = (id: number) => {
    navigate(`/blog/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/blogedit/${id}`);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please sign in again.");
        } else {
          throw new Error("Delete failed");
        }
      }

      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">Loading blogs...</div>
    );
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <div className="flex flex-row gap-5">
          <button
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleSync}
          >
            Sync
          </button>
          <Link
            to="/admin/blogedit/new"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + New Post
          </Link>
        </div>
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
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://t4.ftcdn.net/jpg/02/22/72/07/360_F_222720784_xp8PMs9O24y4lMrLgdgIi9yLw8BbKW98.jpg";
                  }}
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {getCategoryName(post.categoryId)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {post.title}
                </h3>

                <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                  {getExcerpt(post.description)}
                </p>

                <div className="mb-4 flex gap-2 text-xs">
                  <span
                    className={`rounded-full px-3 py-1 font-medium ${
                      post.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.status}
                  </span>
                  {post.feature && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => handleView(post.id)}
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
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => handlePage("prev")}
          disabled={page === 1}
          className="disabled:opacity-40"
        >
          <MdOutlineArrowBackIos />
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => handlePage("next")}
          disabled={page === totalPages}
          className="disabled:opacity-40"
        >
          <MdOutlineArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default AdminBlog;
