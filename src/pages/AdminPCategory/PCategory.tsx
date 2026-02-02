import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface PCategory {
  id: number;
  type: string;
  // productCount: number; // Mocked for frontend
}

const PCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<PCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentCategory, setCurrentCategory] = useState<Partial<PCategory>>(
    {},
  );

  const fetchPCategory = async () => {
    try {
      const res = await api.get("/admin/category");
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPCategory();
  }, []);

  const openModal = (mode: "create" | "edit", category?: PCategory) => {
    setModalMode(mode);
    setCurrentCategory(category ? category : {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory({ ...currentCategory, type: e.target.value });
  };

  const handleSubmit = async () => {
    if (!currentCategory.type) {
      alert("Type is required");
      return;
    }

    try {
      if (modalMode === "create") {
        await api.post("/admin/category/create", {
          type: currentCategory.type,
        });
      } else {
        await api.put(`/admin/category/${currentCategory.id}`, {
          type: currentCategory.type,
        });
      }

      fetchPCategory();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data || "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await api.delete(`/admin/category/${id}`);
      fetchPCategory();
    } catch (error: any) {
      console.error(error);
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
            {/* <th className="py-2 px-4 border-b text-left">Number of Products</th> */}
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="py-2 px-4 border-b">{cat.id}</td>
              <td className="py-2 px-4 border-b">{cat.type}</td>
              {/* <td className="py-2 px-4 border-b">{cat.productCount}</td> */}
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal("edit", cat)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
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
                value={currentCategory.type || ""}
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
