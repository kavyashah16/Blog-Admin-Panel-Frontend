import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import multiapi from "../../api/multipart";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api/axios";
import MultiSelect from "../../components/form/MultiSelect";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";

interface Category {
  id: number;
  type: string;
}

interface AttributeValue {
  id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  value: AttributeValue[];
}

interface VariantAttributeValue {
  attributeId: number;
  attributeValueId: number;
}

interface Variant {
  attributeValues: VariantAttributeValue[];
  price: number;
  status: number;
}

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [attributeSelections, setAttributeSelections] = useState<{ [key: number]: number[] }>({});
  const [fixedPriceMode, setFixedPriceMode] = useState(true);
  const [fixedPrice, setFixedPrice] = useState(0);
  const [fixedStatus, setFixedStatus] = useState(1);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    multiapi.get("admin/category").then((res) => setCategories(res.data.data));
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const res = await api.get("/admin/attribute");
    // Assuming updated backend returns value as [{id, value}]
    setAttributes(res.data.data.map((attr: any) => ({
      ...attr,
      value: attr.value.map((v: string, idx: number) => ({ id: idx + 1, value: v })) // Mock ids if backend not updated; replace with real ids
    })));
  };

  const handleAttributeChange = (selected: string[]) => {
    const selectedIds = selected.map(Number);
    setSelectedAttributes(selectedIds);
    // Reset selections for removed attributes
    setAttributeSelections((prev) => {
      const newSelections: { [key: number]: number[] } = {};
      selectedIds.forEach((id) => {
        if (prev[id]) newSelections[id] = prev[id];
      });
      return newSelections;
    });
    setVariants([]); // Reset variants
  };

  const handleValueChange = (attrId: number, selected: string[]) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attrId]: selected.map(Number),
    }));
    setVariants([]); // Reset variants
  };

  const generateVariants = () => {
    const selectedAttrs = attributes.filter((attr) => selectedAttributes.includes(attr.id));
    const valueArrays: VariantAttributeValue[][] = selectedAttrs.map((attr) => {
      const selectedValues = attributeSelections[attr.id] || [];
      return selectedValues.map((valId) => ({
        attributeId: attr.id,
        attributeValueId: valId,
      }));
    });

    if (valueArrays.some((arr) => arr.length === 0)) {
      setErrors((prev) => ({ ...prev, variants: "Select at least one value per attribute" }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, variants: "" }));
    }

    // Manual Cartesian product
    const generateCombinations = (arrays: VariantAttributeValue[][]): VariantAttributeValue[][] => {
      const result: VariantAttributeValue[][] = [[]];
      for (const arr of arrays) {
        const temp: VariantAttributeValue[][] = [];
        for (const res of result) {
          for (const item of arr) {
            temp.push([...res, item]);
          }
        }
        result.splice(0, result.length, ...temp);
      }
      return result;
    };

    const combinations = generateCombinations(valueArrays);
    const newVariants = combinations.map((combo) => ({
      attributeValues: combo,
      price: fixedPriceMode ? fixedPrice : 0,
      status: fixedPriceMode ? fixedStatus : 1,
    }));
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: "price" | "status", value: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const getAttributeName = (attrId: number) => attributes.find((a) => a.id === attrId)?.name || "";
  const getValueName = (attrId: number, valId: number) => {
    const attr = attributes.find((a) => a.id === attrId);
    return attr?.value.find((v) => v.id === valId)?.value || "";
  };

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
    if (!imageFile && !imagePreview) newErrors.image = "Image is required"; // Allow existing preview for edit
    if (selectedAttributes.length > 0 && variants.length === 0)
      newErrors.variants = "Generate variants after selecting attributes and values";

    if (variants.length > 0) {
      variants.forEach((v, i) => {
        if (v.price <= 0) {
          newErrors[`variant_${i}`] = `Variant ${i + 1} must have a positive price`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      await multiapi.post("/admin/product/create", formData);
      navigate("/admin/product");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold">Create Product</span>
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
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-12">
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
            Image <span className="text-red-500">*</span>
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

        <div>
          <h3 className="font-bold mb-2">
            Variants <span className="text-red-500">*</span>
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Attributes
            </label>
            <MultiSelect
              value={selectedAttributes.map(String)}
              options={attributes.map((a) => ({
                value: String(a.id),
                text: a.name,
              }))}
              placeholder="Select Attributes"
              onChange={(selected) => handleAttributeChange(selected)}
            />
          </div>

          {selectedAttributes.map((attrId) => {
            const attr = attributes.find((a) => a.id === attrId);
            if (!attr) return null;
            return (
              <div key={attrId} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {attr.name} Values
                </label>
                <MultiSelect
                  value={(attributeSelections[attrId] || []).map(String)}
                  options={attr.value.map((v) => ({
                    value: String(v.id),
                    text: v.value,
                  }))}
                  placeholder="Select Values"
                  onChange={(selected) => handleValueChange(attrId, selected)}
                />
              </div>
            );
          })}

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={fixedPriceMode}
              onChange={(e) => setFixedPriceMode(e.target.checked)}
              className="mr-2"
            />
            <label>Use fixed price for all variants</label>
          </div>

          {fixedPriceMode && (
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fixed Price
              </label>
              <input
                type="number"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(Number(e.target.value))}
                className="w-full border p-2 rounded border-gray-300"
                min="0"
              />

              <label className="block text-sm font-medium text-gray-700">
                Fixed Status
              </label>
              <select
                value={fixedStatus}
                onChange={(e) => setFixedStatus(Number(e.target.value))}
                className="w-full border p-2 rounded border-gray-300"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={generateVariants}
            className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
          >
            Generate Variants
          </button>

          {!fixedPriceMode && variants.length > 0 && (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="font-medium mb-2">
                    {variant.attributeValues
                      .map((av) => `${getAttributeName(av.attributeId)}: ${getValueName(av.attributeId, av.attributeValueId)}`)
                      .join(" / ")}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                      className="w-full border p-2 rounded border-gray-300"
                      min="0"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={variant.status}
                      onChange={(e) => updateVariant(index, "status", Number(e.target.value))}
                      className="w-full border p-2 rounded border-gray-300"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                  {errors[`variant_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`variant_${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {errors.variants && (
            <p className="mt-1 text-sm text-red-600">{errors.variants}</p>
          )}
        </div>

        <div className="mb-8 flex items-center justify-end">
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
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;