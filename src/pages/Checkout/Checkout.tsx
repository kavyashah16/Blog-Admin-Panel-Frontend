import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";

interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  variants: {
    id: number;
    value: string;
    price: number;
    status: number;
  }[];
  quantity: number;
}

interface ProductImageMap {
  [productId: number]: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productImages, setProductImages] = useState<ProductImageMap>({});
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Razor Pay",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const validCartItems = storedCart
      .filter((item: any) => item && Array.isArray(item.variants))
      .map((item: any) => ({
        ...item,
        variants: item.variants || [],
      })) as CartItem[];
    setCartItems(validCartItems);

    const fetchImages = async () => {
      const uniqueProductIds = [
        ...new Set(validCartItems.map((item) => item.productId)),
      ];
      const imageMap: ProductImageMap = {};
      for (const id of uniqueProductIds) {
        try {
          const res = await api.get(`/admin/product/${id}`);
          imageMap[id] = res.data.data.image;
        } catch (error) {
          console.error(`Failed to fetch image for product ${id}`, error);
        }
      }
      setProductImages(imageMap);
    };
    fetchImages();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerName.trim())
      newErrors.customerName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getItemPrice = (item: CartItem) => {
    return item.variants?.reduce((sum, v) => sum + v.price, 0) ?? 0;
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + getItemPrice(item) * item.quantity,
      0,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || cartItems.length === 0) return;
    try {
      setLoading(true);
      const totalAmount = getTotal();

      const { data: order } = await api.post("/payment/razorpay/order", {
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_API_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          await api.post("/payment/order/create", {
            customer: formData,
            totalAmount,
            cartItems: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              variants: item.variants,
              price: getItemPrice(item),
              quantity: item.quantity,
            })),
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          navigate("/payment-success");
        },
        prefill: {
          name: formData.customerName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <span className="text-3xl font-bold mb-8 text-center">Checkout</span>
        <p className="text-center text-gray-500 text-lg">
          Your cart is empty. Add items to proceed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <span className="text-3xl font-bold mb-8 text-center">Checkout</span>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-6 bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <span className="text-2xl font-bold mb-4 text-gray-900">
              Shipping Information
            </span>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.customerName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.address ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.city ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>

            {/* <span className="text-2xl font-bold mt-8 mb-4 text-gray-900">
              Payment Method
            </span>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full border p-2 rounded border-gray-300"
            >
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select> */}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sticky top-4 h-fit">
            <span className="text-2xl font-bold mb-4 text-gray-900">
              Order Summary
            </span>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => {
                const itemPrice = getItemPrice(item);
                return (
                  <div key={index} className="flex items-start gap-4">
                    <img
                      src={
                        productImages[item.productId] ||
                        "https://via.placeholder.com/64"
                      }
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">
                        {item.productName}
                      </span>
                      <p className="text-sm text-gray-600">
                        Variants:{" "}
                        {item.variants.length > 0
                          ? item.variants
                              .map(
                                (v) =>
                                  `${v.value}: ₹${v.price.toLocaleString()}`,
                              )
                              .join(", ")
                          : "No variants"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-teal-600">
                        ₹{(itemPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold mt-6 disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
