import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Types
interface Category {
  id: number;
  name: string;
}

interface BlogFormData {
  title: string;
  description: string;
  image: File | null;
  imageURl: string;
  feature: Number;
  status: "DRAFT" | "PUBLISHED";
  categoryId: number | null;
}

const API_BASE = "http://localhost:5000";

export default function BlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const quillRef = useRef<ReactQuill>(null);

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    description: "",
    image: null,
    imageURl: "",
    feature: 0,
    status: "DRAFT",
    categoryId: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/signin");
          } else {
            throw new Error("Failed to fetch categories");
          }
        }
        const { data } = await res.json();
        setCategories(data || []);
      } catch (err) {
        alert((err as Error).message);
      }
    };

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/admin/signin");
          } else {
            throw new Error("Failed to fetch post");
          }
        }
        const { data: post } = await res.json();
        if (!post) throw new Error("Post not found");
        setForm({
          title: post.title,
          description: post.description,
          image: null,
          imageURl: post.image,
          feature: post.feature,
          status: post.status,
          categoryId: post.categoryId,
        });
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (!isNew) fetchPost();
  }, [id, isNew, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (
      quillRef.current &&
      quillRef.current.getEditor().getText().trim() === ""
    ) {
      newErrors.description = "Content cannot be empty";
    }
    if (isNew && !form.image) {
      newErrors.image = "Image is required";
    }

    if (form.categoryId == null)
      newErrors.categoryId = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent, publish = false) => {
    e.preventDefault();
    if (!validate()) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    let cleanedDescription = form.description;
    cleanedDescription = cleanedDescription.replace(/&nbsp;/g, " ");

    // const submitData = {
    //   ...form,
    //   description: cleanedDescription,
    //   status: publish ? "PUBLISHED" : form.status,
    // };

    if (isNew && !form.image) {
      alert("Image is required");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", cleanedDescription);
    formData.append("feature", String(form.feature));
    formData.append("status", publish ? "PUBLISHED" : form.status);
    formData.append("categoryId", String(form.categoryId));

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const url = isNew ? `${API_BASE}/blog/create` : `${API_BASE}/blog/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/admin/signin");
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Submit failed");
        }
      }

      alert(publish ? "Published!" : "Saved!");
      navigate("/admin/blog");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">Loading post...</div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          {isNew ? "Create New Post" : "Edit Post"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/blog")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {isNew && (
            <button
              onClick={(e) => handleSubmit(e, false)}
              className="rounded-lg bg-gray-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Save Draft
            </button>
          )}
          <button
            onClick={(e) => handleSubmit(e, true)}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isNew ? "Publish" : "Update & Publish"}
          </button>
        </div>
      </div>

      <form className="space-y-8" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full rounded-lg border ${errors.title ? "border-red-500" : "border-gray-300"} px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImage}
            className={`w-full rounded-lg border ${errors.image ? "border-red-500" : "border-gray-300"} px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
          {!form.image && form.imageURl && (
            <img
              src={form.imageURl}
              alt="Preview"
              className="mt-4 h-40 w-auto rounded-lg object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://t4.ftcdn.net/jpg/02/22/72/07/360_F_222720784_xp8PMs9O24y4lMrLgdgIi9yLw8BbKW98.jpg")
              }
            />
          )}
          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview"
              className="mt-4 h-40 w-auto rounded-lg object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://t4.ftcdn.net/jpg/02/22/72/07/360_F_222720784_xp8PMs9O24y4lMrLgdgIi9yLw8BbKW98.jpg")
              }
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId ?? ""}
              onChange={handleChange}
              className={`w-full rounded-lg border ${errors.categoryId ? "border-red-500" : "border-gray-300"} px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 bg-white`}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="feature"
              checked={form.feature === 1}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Featured Post
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <div
            className={
              errors.description
                ? "border border-red-500 rounded-lg overflow-hidden"
                : ""
            }
          >
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={form.description}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, description: value }));
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className="h-96 bg-white"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "blockquote", "code-block"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </form>
    </div>
  );
}
