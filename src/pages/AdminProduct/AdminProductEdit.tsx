import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import multiapi from "../../api/multipart";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface Category {
  id: number;
  type: string;
}

interface Attribute {
  id: number;
  value: string;
  categoryId: number;
}

interface Variant {
  attributeId: number;
  value: string;
  price: number;
  status: number;
}

const ProductEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id && !isNaN(Number(id)));

  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    attributeId: 0,
    value: "",
    price: 0,
    status: 1,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const quillRef = useRef<ReactQuill>(null);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    multiapi.get("admin/category").then((res) => setCategories(res.data.data));
    multiapi
      .get("/admin/attribute")
      .then((res) => setAttributes(res.data.data));
  }, []);

  useEffect(() => {
    if (categoryId) {
      setFilteredAttributes(
        attributes.filter((a) => a.categoryId === categoryId),
      );
    } else {
      setFilteredAttributes([]);
    }
  }, [categoryId, attributes]);

  /* ---------------- EDIT MODE LOAD ---------------- */

  useEffect(() => {
    if (!isEdit) return;

    multiapi.get(`/admin/product/${id}`).then((res) => {
      const p = res.data.data;
      setName(p.name);
      setDescription(p.description);
      setCategoryId(p.categoryId);
      setImagePreview(p.image);
      setVariants(
        p.productAttributes.map((v: any) => ({
          attributeId: v.attributeId,
          value: v.value,
          price: v.price,
          status: v.status,
        })),
      );
    });
  }, [id, isEdit]);

  /* ---------------- HANDLERS ---------------- */

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(Number(e.target.value));
    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: "" }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleNewVariantChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewVariant({
      ...newVariant,
      [name]:
        name === "attributeId" || name === "price" || name === "status"
          ? Number(value)
          : value,
    });
  };

  const addVariant = () => {
    if (!newVariant.attributeId || !newVariant.value || !newVariant.price) {
      alert("All variant fields required");
      return;
    }
    setVariants([...variants, newVariant]);
    setNewVariant({ attributeId: 0, value: "", price: 0, status: 1 });
    if (errors.variants) setErrors((prev) => ({ ...prev, variants: "" }));
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (
      quillRef.current &&
      quillRef.current.getEditor().getText().trim() === ""
    ) {
      newErrors.description = "Description cannot be empty";
    }
    if (categoryId === "") newErrors.categoryId = "Please select a category";
    if (!isEdit && !imageFile) newErrors.image = "Image is required";
    if (variants.length === 0)
      newErrors.variants = "At least one variant is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validate()) return;

    let cleanedDescription = description;
    cleanedDescription = cleanedDescription.replace(/&nbsp;/g, " ");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", cleanedDescription);
    formData.append("categoryId", String(categoryId));
    formData.append("variants", JSON.stringify(variants));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEdit) {
        await multiapi.put(`/admin/product/${id}`, formData);
      } else {
        await multiapi.post("/admin/product/create", formData);
      }
      navigate("/admin/product");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold">
          {isEdit ? "Edit Product" : "Create Product"}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/product")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <div
            className={`${
              errors.description
                ? "border border-red-500 rounded-lg overflow-hidden"
                : ""
            }`}
          >
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className="h-64 bg-white"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full border p-2 rounded ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
            value={categoryId}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.type}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image {isEdit ? "" : <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className={`w-full border p-2 rounded ${errors.image ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 mt-2 rounded"
            />
          )}
        </div>

        {/* VARIANTS */}
        <div>
          <h3 className="font-bold mb-2">
            Variants <span className="text-red-500">*</span>
          </h3>

          {variants.map((v, i) => (
            <div key={i} className="mb-1 flex items-center">
              <span>
                {v.value} – ₹{v.price}
              </span>
              <button
                onClick={() => removeVariant(i)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
          ))}

          <select
            name="attributeId"
            value={newVariant.attributeId}
            onChange={handleNewVariantChange}
            className="w-full border p-2 mt-3 rounded"
          >
            <option value={0}>Select Attribute</option>
            {filteredAttributes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.value}
              </option>
            ))}
          </select>

          <input
            name="value"
            placeholder="Value"
            className="w-full border p-2 mt-2 rounded"
            value={newVariant.value}
            onChange={handleNewVariantChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="w-full border p-2 mt-2 rounded"
            value={newVariant.price}
            onChange={handleNewVariantChange}
          />

          <button
            onClick={addVariant}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Add Variant
          </button>

          {errors.variants && (
            <p className="mt-1 text-sm text-red-600">{errors.variants}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
