import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api/axios";
import { useMemo } from "react";

interface Attribute {
  id: number;
  value: string;
}

interface Variant {
  id: number;
  attributeId: number;
  value: string;
  price: number;
  status: number;
  attribute: Attribute;
}

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  productAttributes: Variant[];
}

interface AttributeValue {
  id: number;
  value: string;
  price: number;
  status: number;
}

interface GroupAttribute {
  attributeId: number;
  attributeName: string;
  values: AttributeValue[];
}

const groupAttributes = (productAttributes: Variant[]): GroupAttribute[] => {
  const map = new Map<number, GroupAttribute>();

  productAttributes.forEach((item) => {
    if (!item.attributeId || !item.attribute) return;

    const attrId = item.attributeId;

    if (!map.has(attrId)) {
      map.set(attrId, {
        attributeId: attrId,
        attributeName: item.attribute.value,
        values: [],
      });
    }

    map.get(attrId)!.values.push({
      id: item.id,
      value: item.value,
      price: item.price,
      status: item.status,
    });
  });

  return Array.from(map.values());
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [attributeId: number]: AttributeValue;
  }>({});

  const [quantity, setQuantity] = useState(1);

  const groupedAttributes = useMemo(() => {
    if (!product?.productAttributes) return [];
    return groupAttributes(product.productAttributes);
  }, [product]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/product/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    }
  };

  const totalPrice = Object.values(selectedAttributes).reduce(
    (sum, v) => sum + v.price,
    0,
  );

  const addToCart = () => {
    if (!product || Object.keys(selectedAttributes).length === 0) {
      alert("Please select a variant");
      return;
    }

    const cartItem = {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      variants: Object.values(selectedAttributes),
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]") || [];

    const existingIndex = existingCart.findIndex(
      (item: any) =>
        item.productId === product.id &&
        JSON.stringify(item.variants) ===
          JSON.stringify(Object.values(selectedAttributes)),
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    setSelectedAttributes({});
    setQuantity(1);

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

          <p className="text-2xl font-semibold text-teal-600 mb-4">
            ₹{totalPrice.toLocaleString()}
          </p>

          <div className="mb-6">
            <span className="font-semibold mb-3 text-gray-700">
              Select Options
            </span>

            <div className="flex flex-wrap gap-3">
              {groupedAttributes.map((attr) => (
                <div key={attr.attributeId} className="mb-6">
                  <span className="font-semibold mb-2 text-gray-700 block">
                    {attr.attributeName}
                  </span>

                  <div className="flex flex-wrap gap-3">
                    {attr.values.map((val) => (
                      <button
                        key={val.id}
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attr.attributeId]: val,
                          }))
                        }
                        className={`px-4 py-2 border rounded transition ${
                          selectedAttributes[attr.attributeId]?.id === val.id
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-white border-gray-300 hover:border-teal-400"
                        }`}
                      >
                        {val.value} — ₹{val.price.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          <button
            onClick={addToCart}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            Add to Cart
          </button>

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
