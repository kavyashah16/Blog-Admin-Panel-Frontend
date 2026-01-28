import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SmallBlogCard from "../../components/card/blogdetail/SmallBlogCard";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  author?: string;
  categoryId: number;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE = "http://localhost:5000";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat?.name || "Uncategorized";
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [blogRes, blogsRes, catsRes] = await Promise.all([
          fetch(`${API_BASE}/blog/${id}`),
          fetch(`${API_BASE}/blog`),
          fetch(`${API_BASE}/category`),
        ]);

        const blogData = await blogRes.json();
        console.log("DESC LENGTH:", blogData.data.description.length);
        console.log("DESC PREVIEW:", blogData.data.description.slice(0, 500));

        const blogsData = await blogsRes.json();
        const catsData = await catsRes.json();

        if (!blogData?.data) {
          setBlog(null);
          return;
        }

        const publishedBlogs: Blog[] = (blogsData.data || []).filter(
          (b: Blog) => b.status !== "DRAFT",
        );

        setBlog(blogData.data);
        setRecentBlogs(
          publishedBlogs.filter((b) => b.id !== Number(id)).slice(0, 4),
        );
        setCategories(catsData.data || []);
      } catch (error) {
        console.error("Failed to fetch blog detail", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        <div className="container text-center mt-20">
          <p>Loading blog...</p>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="section">
        <div className="container text-center mt-20">
          <p>Blog not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <img
            src={blog.image || "/blog.jpg"}
            alt={blog.title}
            className="w-full object-cover rounded-md mb-6"
          />

          <span className="inline-block text-sm bg-[#155efc19] text-gray-600 px-3 py-1 rounded-full mb-4 font-jakarta">
            {getCategoryName(blog.categoryId)}
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-3 font-jakarta">
            {blog.title}
          </h1>

          <p className="text-sm text-gray-500 mb-6 font-jakarta">
            By {blog.author || "Admin"} •{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <div
            className="text-gray-700 leading-relaxed font-jakarta prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>

        <div className="border rounded-md border-[#f2eaea] shadow-md hover:shadow-lg p-6">
          <h3 className="mb-4 font-semibold">Recent Posts</h3>

          <div className="flex flex-col gap-4">
            {recentBlogs.map((item) => (
              <SmallBlogCard
                key={item.id}
                id={item.id}
                img={item.image}
                title={item.title}
                date={new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                tag={getCategoryName(item.categoryId)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
