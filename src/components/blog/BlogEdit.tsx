// components/blog/BlogEdit.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // snow theme (you can choose bubble too)

// ────────────────────────────────────────────────
//  Types
// ────────────────────────────────────────────────
interface Tag {
  id: string;
  name: string;
}

interface BlogFormData {
  title: string;
  content: string;
  topic: string;
  tags: Tag[];
  featuredImage: File | null;
  imagePreview: string | null;
  status: 'draft' | 'published';
}

// ────────────────────────────────────────────────
//  Mock data – replace with real API later
// ────────────────────────────────────────────────
const mockTopics = ['React', 'Next.js', 'Tailwind', 'JavaScript', 'TypeScript', 'UI/UX', 'Performance', 'Career'];

const mockExistingPost: BlogFormData = {
  title: 'Building a Modern Blog Dashboard',
  content: '<p>This is a sample blog post content...</p><h2>Why React + Tailwind?</h2><p>Because it is fast, beautiful and developer-friendly.</p>',
  topic: 'React',
  tags: [
    { id: 't1', name: 'frontend' },
    { id: 't2', name: 'tailwindcss' },
    { id: 't3', name: 'react-2025' },
  ],
  featuredImage: null,
  imagePreview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  status: 'draft',
};

// ────────────────────────────────────────────────
export default function BlogEdit() {
  const { id } = useParams<{ id: string }>(); // :id or "new"
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState<BlogFormData>({
    title: '',
    content: '',
    topic: '',
    tags: [],
    featuredImage: null,
    imagePreview: null,
    status: 'draft',
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Simulate fetching post data
  useEffect(() => {
    if (!isNew) {
      // TODO: real API call → get post by id
      setTimeout(() => {
        setForm(mockExistingPost);
      }, 400);
    }
  }, [id, isNew]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        featuredImage: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const tagName = newTag.trim().toLowerCase();
    if (form.tags.some((t) => t.name.toLowerCase() === tagName)) return;

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, { id: `tag-${Date.now()}`, name: tagName }],
    }));
    setNewTag('');
  };

  const removeTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== tagId),
    }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.topic) newErrors.topic = 'Please select a topic';
    if (!form.content.trim()) newErrors.content = 'Content cannot be empty';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent, publish = false) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...form,
      status: publish ? 'published' : 'draft',
      // featuredImage: form.featuredImage ? await uploadToServer(...) : null
    };

    console.log('Submitting:', submitData);

    // TODO: real API call (POST / PATCH)
    // await api.post('/blogs', submitData)  or patch if !isNew

    alert(publish ? 'Published!' : 'Saved as draft!');
    navigate('/blog');
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/blog')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            className="rounded-lg bg-gray-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isNew ? 'Publish' : 'Update & Publish'}
          </button>
        </div>
      </div>

      <form className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500`}
            placeholder="Enter an engaging title..."
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Topic + Tags row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic / Category <span className="text-red-500">*</span>
            </label>
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className={`w-full rounded-lg border ${
                errors.topic ? 'border-red-500' : 'border-gray-300'
              } px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 bg-white`}
            >
              <option value="">Select topic...</option>
              {mockTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Type tag and press Enter"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
          <div className="flex items-center gap-6">
            <div className="h-40 w-64 overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">PNG, JPG, max 5MB recommended</p>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <div className={errors.content ? 'border border-red-500 rounded-lg' : ''}>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, content: value }));
                if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
              }}
              className="h-96 bg-white rounded-lg"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image', 'blockquote', 'code-block'],
                  [{ align: [] }],
                  ['clean'],
                ],
              }}
            />
          </div>
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
      </form>
    </div>
  );
}