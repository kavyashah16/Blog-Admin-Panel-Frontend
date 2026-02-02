import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../../api/axios";

interface Category {
  id: number;
  type: string;
}

interface ProductAttribute {
  id: number;
  attributeId: number;
  value: string;
  price: number;
  status: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  categoryId: number;
  category: Category;
  productAttributes: ProductAttribute[];
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 10;


  const fetchProducts = async (page: number) => {
    try {
      const res = await api.get("/admin/product", {
        params: { page, limit },
      });

      setProducts(res.data.data.data);
      setTotalPages(res.data.data.pagination.totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);


  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/admin/product/${id}`);
      fetchProducts(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = (id: number) => {
    navigate(`/products/details/${id}`);
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <span className="text-2xl font-bold">Product List</span>
        <Link
          to="/admin/product/edit/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Product
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Variants</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="p-2 border">{product.id}</td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover"
                />
              </td>
              <td className="p-2 border">
                {product.description.slice(0, 50)}...
              </td>
              <td className="p-2 border">{product.category?.type}</td>
              <td className="p-2 border">
                {product.productAttributes.length}
              </td>
              <td className="p-2 border">
                <Link
                  to={`/admin/product/edit/${product.id}`}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleView(product.id)}
                  className="text-green-500"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductListPage;
