import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  variants: {
    attributeId: number;
    value: string;
    price: number;
    status: number;
  }[];
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("cart") || "[]",
    ) as CartItem[];
    setCartItems(storedCart);
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = Math.max(
      1,
      updatedCart[index].quantity + delta,
    );
    updateCart(updatedCart);
  };

  const getTotal = () =>
    cartItems.reduce(
      (total, item) =>
        total + item.variants.reduce((s, v) => s + v.price, 0) * item.quantity,
      0,
    );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <span className="text-3xl font-bold mb-8 text-center">
          Shopping Cart
        </span>
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/product")}
            className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <span className="text-3xl font-bold mb-8 text-center">Shopping Cart</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.map((item, index) => {
            const variantPrice = item.variants.reduce(
              (sum, v) => sum + v.price,
              0,
            );
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-start gap-4"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <span className="text-xl font-semibold text-gray-900">
                    {item.productName}
                  </span>
                  <p className="text-gray-600">
                    Variants: {item.variants.map((v) => v.value).join(", ")}
                  </p>

                  <p className="text-lg font-bold text-teal-600">
                    ₹{variantPrice.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Subtotal: ₹{(variantPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  × Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Right side: Pricing details */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sticky top-4 h-fit">
          <span className="text-2xl font-bold mb-4 text-gray-900">
            Order Summary
          </span>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{getTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{getTotal().toLocaleString()}</span>
            </div>
          </div>
          <Link
            to={"/checkout"}
            className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            Checkout
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/product")}
          className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartPage;
