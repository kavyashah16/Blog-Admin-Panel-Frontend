import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Category {
  id: number;
  type: string;
}

interface Attribute {
  id: number;
  value: string;
  categoryId: number;
  // variantCount: number;  Mocked for frontend
}

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentAttribute, setCurrentAttribute] = useState<Partial<Attribute>>(
    {},
  );

  const fetchAttributes = async () => {
    try {
      const res = await api.get("/admin/attribute");
      setAttributes(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPCategory = async () => {
    try {
      const res = await api.get("/admin/category");
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttributes();
    fetchPCategory();
  }, []);

  const openModal = (mode: "create" | "edit", attribute?: Attribute) => {
    setModalMode(mode);
    setCurrentAttribute(attribute ?? {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAttribute({});
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

  const handleSubmit = async () => {
    if (!currentAttribute.value || !currentAttribute.categoryId) {
      alert("Value and Category are required");
      return;
    }

    try {
      if (modalMode === "create") {
        await api.post("/admin/attribute/create", {
          value: currentAttribute.value,
          categoryId: currentAttribute.categoryId,
        });
      } else {
        await api.put(`/admin/attribute/${currentAttribute.id}`, {
          value: currentAttribute.value,
          categoryId: currentAttribute.categoryId,
        });
      }

      fetchAttributes();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      await api.delete(`/admin/attribute/${id}`);
      fetchAttributes();
    } catch (err) {
      console.error(err);
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
            {/* <th className="py-2 px-4 border-b text-left">Number of Variants</th> */}
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute.id}>
              <td className="py-2 px-4 border-b">{attribute.id}</td>
              <td className="py-2 px-4 border-b">{attribute.value}</td>
              <td className="py-2 px-4 border-b">
                {categories.find((c) => c.id === attribute.categoryId)
                  ?.type || "Unknown"}
              </td>
              {/* <td className="py-2 px-4 border-b">{attribute.variantCount}</td> */}
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
                {categories.map((category) => (
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
