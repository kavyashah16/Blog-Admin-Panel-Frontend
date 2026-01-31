import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CreateUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setRefresh((prev) => !prev);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/edituser/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/edituser/new");
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">Loading users...</div>
    );
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
