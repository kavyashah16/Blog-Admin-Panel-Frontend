import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios";

interface Variant {
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
  category: {
    id: number;
    type: string;
  };
  productAttributes: Variant[];
}

interface Pagination {
  totalPage: number;
  currentPage: number;
  limit: number;
  totalProducts: number;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page: number) => {
    try {
      const res = await api.get(`/admin/product?page=${page}&limit=${limit}`);

      setProducts(res.data.data.data);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const getMinPrice = (variants: Variant[]) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map((v) => v.price));
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <span className="text-3xl font-bold mb-6">Our Products</span>

      <div className="space-y-4 mt-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-300 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-32 mb-4 sm:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-md"
                loading="lazy"
              />
            </div>

            <div className="sm:ml-6 flex-grow">
              <span className="text-xl font-semibold text-blue-800 hover:text-blue-600 ">
                <Link to={`/product/${product.id}`}>{product.name}<br/></Link>
              </span>

              {/* <p className="text-gray-600 mb-2 line-clamp-3">
                {product.description}
              </p> */}

              <p className="text-sm text-gray-500 mb-2">
                Category: {product.category?.type || "Unknown"}
              </p>

              <span className="text-lg">
                ₹{getMinPrice(product.productAttributes).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No products available.</p>
      )}

      {pagination && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 transition duration-200"
          >
            Previous
          </button>

          <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded">
            Page {pagination.currentPage} of {pagination.totalPage}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPage))
            }
            disabled={currentPage === pagination.totalPage}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 transition duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;
