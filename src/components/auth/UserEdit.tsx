import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "user";
}

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { token } = useAuth();

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    role: "user",
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isNew) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role || "user",
        });
      } catch {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isNew, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isNew) {
        await api.post("/user", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/user/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate("/admin/createuser");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading user...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isNew ? "Create User" : "Edit User"}
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={!isNew}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring disabled:bg-gray-100"
          />
          {!isNew && (
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : isNew ? "Create User" : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/createuser")}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
