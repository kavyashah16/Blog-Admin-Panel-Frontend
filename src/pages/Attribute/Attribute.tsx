import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Category {
  id: number;
  type: string;
}

interface Attribute {
  id: number;
  name: string;
  value: string[];
}

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentAttribute, setCurrentAttribute] = useState<{
    name?: string;
    value: string[];
  }>({
    value: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);

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

    if (mode === "edit" && attribute) {
      setEditingId(attribute.id);
      setCurrentAttribute({
        name: attribute.name,
        value: attribute.value ?? [],
      });
    } else {
      setEditingId(null);
      setCurrentAttribute({
        name: "",
        value: [],
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setCurrentAttribute({
      name: "",
      value: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setCurrentAttribute((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleSubmit = async () => {
    if (!currentAttribute.name || currentAttribute.value.length === 0) {
      alert("Name and at least one value are required");
      return;
    }

    try {
      if (modalMode === "create") {
        await api.post("/admin/attribute/create", {
          name: currentAttribute.name,
          value: currentAttribute.value,
        });
      } else {
        if (!editingId) return;

        await api.put(`/admin/attribute/${editingId}`, {
          name: currentAttribute.name,
          value: currentAttribute.value,
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
            <th className="py-2 px-4 border-b text-left">Attribute Name</th>
            <th className="py-2 px-4 border-b text-left">Values</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute.id}>
              <td className="py-2 px-4 border-b">{attribute.id}</td>

              {/* ATTRIBUTE NAME */}
              <td className="py-2 px-4 border-b font-medium">
                {attribute.name}
              </td>

              {/* ATTRIBUTE VALUES */}
              <td className="py-2 px-4 border-b">
                {attribute.value.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {attribute.value.map((val, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-sm px-2 py-1 rounded"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No values</span>
                )}
              </td>

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa] bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <span className="text-xl font-bold mb-4">
              {modalMode === "create" ? "Create" : "Edit"} Attribute
            </span>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Attribute Name
              </label>
              <input
                type="text"
                name="name"
                value={currentAttribute.name || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Values</label>

              {currentAttribute.value.map((val, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const newValues = [...currentAttribute.value];
                      newValues[index] = e.target.value;
                      setCurrentAttribute({
                        ...currentAttribute,
                        value: newValues,
                      });
                    }}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded"
                  />
                  <button
                    onClick={() => {
                      const newValues = currentAttribute.value.filter(
                        (_, i) => i !== index,
                      );
                      setCurrentAttribute({
                        ...currentAttribute,
                        value: newValues,
                      });
                    }}
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setCurrentAttribute({
                    ...currentAttribute,
                    value: [...currentAttribute.value, ""],
                  })
                }
                className="text-blue-500 text-sm mt-2"
              >
                + Add value
              </button>
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
