import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api/axios";

interface Variant {
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
  productAttributes: Variant[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product && product.productAttributes.length > 0 && !selectedVariant) {
      setSelectedVariant(product.productAttributes[0]);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/product/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    }
  };

  const addToCart = () => {
    if (!product || !selectedVariant) {
      alert("Please select a variant");
      return;
    }

    const cartItem = {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      variant: {
        id: selectedVariant.id,
        attributeId: selectedVariant.attributeId,
        value: selectedVariant.value,
        price: selectedVariant.price,
        status: selectedVariant.status,
      },
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]") || [];

    const existingIndex = existingCart.findIndex(
      (item: any) =>
        item.productId === product.id && item.variant.id === selectedVariant.id,
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Product added to cart");
  };

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-4 rounded-lg shadow-md self-start">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
        </div>

        <div>
          <span className="text-3xl font-bold mb-4 text-gray-900">
            {product.name}
          </span>

          {selectedVariant && (
            <p className="text-2xl font-semibold text-teal-600 mb-4">
              ₹{selectedVariant.price.toLocaleString()}
            </p>
          )}

          {/* VARIANTS */}
          <div className="mb-6">
            <span className="font-semibold mb-3 text-gray-700">
              Select Variant
            </span>

            <div className="flex flex-wrap gap-3">
              {product.productAttributes.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 border rounded transition ${
                    selectedVariant?.id === variant.id
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {variant.value} — ₹{variant.price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold text-gray-700">Quantity</span>

            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                −
              </button>

              <span className="px-4 py-2 bg-gray-50">{quantity}</span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            Add to Cart
          </button>

          {/* PRODUCT DESCRIPTION AFTER ADD TO CART */}
          <div className="mt-8">
            <span className="text-2xl font-bold mb-4 text-gray-800">
              Product Description
            </span>
            <div
              className="text-gray-600 max-w-none product-description"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
