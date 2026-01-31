import React, { useState } from "react";

// Define the interface for Category (mocked)
interface Category {
  id: number;
  type: string;
}

// Define the interface for Attribute
interface Attribute {
  id: number;
  value: string;
  categoryId: number;
  variantCount: number; // Mocked for frontend
}

// Mock data for categories
const mockedCategories: Category[] = [
  { id: 1, type: "Electronics" },
  { id: 2, type: "Clothing" },
  { id: 3, type: "Books" },
];

// Mock data for attributes (since no backend integration)
const initialAttributes: Attribute[] = [
  { id: 1, value: "Color", categoryId: 2, variantCount: 5 },
  { id: 2, value: "Size", categoryId: 2, variantCount: 10 },
  { id: 3, value: "Brand", categoryId: 1, variantCount: 3 },
];

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentAttribute, setCurrentAttribute] = useState<Partial<Attribute>>({
    value: "",
    categoryId: undefined,
  });
  const [nextId, setNextId] = useState(4); // For mocking new IDs

  const openModal = (mode: "create" | "edit", attribute?: Attribute) => {
    setModalMode(mode);
    setCurrentAttribute(
      attribute
        ? {
            id: attribute.id,
            value: attribute.value,
            categoryId: attribute.categoryId,
          }
        : { value: "", categoryId: undefined },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentAttribute({
      ...currentAttribute,
      [name]: name === "categoryId" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!currentAttribute.value || !currentAttribute.categoryId) {
      alert("Value and Category are required");
      return;
    }

    const attrValue = currentAttribute.value.trim();
    const attrCategoryId = currentAttribute.categoryId;

    if (modalMode === "create") {
      if (
        attributes.some(
          (a) => a.value === attrValue && a.categoryId === attrCategoryId,
        )
      ) {
        alert("Attribute already exists for this category");
        return;
      }
      const newAttribute: Attribute = {
        id: nextId,
        value: attrValue,
        categoryId: attrCategoryId,
        variantCount: 0, // Start with 0 variants
      };
      setAttributes([...attributes, newAttribute]);
      setNextId(nextId + 1);
    } else if (modalMode === "edit" && currentAttribute.id) {
      if (
        attributes.some(
          (a) =>
            a.id !== currentAttribute.id &&
            a.value === attrValue &&
            a.categoryId === attrCategoryId,
        )
      ) {
        alert("Attribute already exists for this category");
        return;
      }
      setAttributes(
        attributes.map((attr) =>
          attr.id === currentAttribute.id
            ? { ...attr, value: attrValue, categoryId: attrCategoryId }
            : attr,
        ),
      );
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this attribute?")) {
      setAttributes(attributes.filter((attr) => attr.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold">Attributes</span>
        <button
          onClick={() => openModal("create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create New
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Value</th>
            <th className="py-2 px-4 border-b text-left">Category</th>
            <th className="py-2 px-4 border-b text-left">Number of Variants</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute, index) => (
            <tr
              key={attribute.id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-2 px-4 border-b">{attribute.id}</td>
              <td className="py-2 px-4 border-b">{attribute.value}</td>
              <td className="py-2 px-4 border-b">
                {mockedCategories.find((c) => c.id === attribute.categoryId)
                  ?.type || "Unknown"}
              </td>
              <td className="py-2 px-4 border-b">{attribute.variantCount}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal("edit", attribute)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(attribute.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa] bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <span className="text-xl font-bold mb-4">
              {modalMode === "create" ? "Create" : "Edit"} Attribute
            </span>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="text"
                name="value"
                value={currentAttribute.value}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="categoryId"
                value={currentAttribute.categoryId || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {mockedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {modalMode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeManager;
