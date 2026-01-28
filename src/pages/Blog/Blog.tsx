import { FC, useEffect, useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useSearchParams } from "react-router";
import BlogCard from "../../components/card/blog/BlogCard";

const API_BASE = "http://localhost:5000";

/* ===================== TYPES ===================== */

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "DRAFT" | "PUBLISHED";
  categoryId: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface BlogApiResponse {
  data: Blog[];
  pagination: {
    totalPage: number;
  };
}

interface CategoryApiResponse {
  data: Category[];
}

/* ===================== COMPONENT ===================== */

const Blog: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const page: number = Number(searchParams.get("page")) || 1;


  const handlePage = (direction: "prev" | "next"): void => {
    if (direction === "prev" && page > 1) {
      setSearchParams({ page: String(page - 1) });
    }

    if (direction === "next" && page < totalPages) {
      setSearchParams({ page: String(page + 1) });
    }
  };


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch(`${API_BASE}/blog/published?page=${page}&limit=${limit}`),
          fetch(`${API_BASE}/category`),
        ]);

        const blogsData: BlogApiResponse = await blogsRes.json();
        const catsData: CategoryApiResponse = await catsRes.json();

        const publishedBlogs = (blogsData.data || []).filter(
          (blog) => blog.status !== "DRAFT",
        );

        setBlogs(publishedBlogs);
        setCategories(catsData.data || []);
        setTotalPages(blogsData.pagination.totalPage);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);


  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (html: string): string => {
    let text = html.replace(/<[^>]+>/g, "");
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/\s+/g, " ").trim();

    return text.length > 150 ? `${text.slice(0, 150)}...` : text;
  };


  if (loading) {
    return (
      <section className="section">
        <div className="container text-center max-w-4xl">
          <p>Loading blogs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container text-center max-w-4xl">
        <div className="flex flex-col mb-8 gap-3">
          <h1>Resources and insights</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            laudantium similique cumque unde sunt quidem eius cum ipsa non
            ratione aperiam veniam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              img={blog.image}
              tag={getCategoryName(blog.categoryId)}
              title={blog.title}
              desc={getExcerpt(blog.description)}
              date={formatDate(blog.createdAt)}
            />
          ))}
        </div>

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
    </section>
  );
};

export default Blog;
