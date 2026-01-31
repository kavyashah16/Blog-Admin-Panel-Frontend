import React, { useState } from "react";

// Define the interface for Product Category
interface PCategory {
  id: number;
  type: string;
  productCount: number; // Mocked for frontend
}

// Mock data for demonstration (since no backend integration)
const initialCategories: PCategory[] = [
  { id: 1, type: "Electronics", productCount: 15 },
  { id: 2, type: "Clothing", productCount: 8 },
  { id: 3, type: "Books", productCount: 20 },
];

const PCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<PCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentCategory, setCurrentCategory] = useState<Partial<PCategory>>({
    type: "",
  });
  const [nextId, setNextId] = useState(4); // For mocking new IDs

  const openModal = (mode: "create" | "edit", category?: PCategory) => {
    setModalMode(mode);
    setCurrentCategory(
      category ? { id: category.id, type: category.type } : { type: "" },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory({ ...currentCategory, type: e.target.value });
  };

  const handleSubmit = () => {
    if (!currentCategory.type) {
      alert("Type is required");
      return;
    }

    if (modalMode === "create") {
      const newCategory: PCategory = {
        id: nextId,
        type: currentCategory.type,
        productCount: 0, // Start with 0 products
      };
      setCategories([...categories, newCategory]);
      setNextId(nextId + 1);
    } else if (modalMode === "edit" && currentCategory.id) {
      setCategories(
        categories.map((cat) =>
          cat.id === currentCategory.id
            ? { ...cat, type: currentCategory.type! }
            : cat,
        ),
      );
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold">Product Categories</span>
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
            <th className="py-2 px-4 border-b text-left">Type</th>
            <th className="py-2 px-4 border-b text-left">Number of Products</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border-b">{category.id}</td>
              <td className="py-2 px-4 border-b">{category.type}</td>
              <td className="py-2 px-4 border-b">{category.productCount}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal("edit", category)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
        <div className="fixed inset-0 flex items-center justify-center shadow-2xl bg-[#fafafa] bg-opacity-0">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <span className="text-xl font-bold mb-4">
              {modalMode === "create" ? "Create" : "Edit"} Category
            </span>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <input
                type="text"
                value={currentCategory.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
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

export default PCategoryManager;
