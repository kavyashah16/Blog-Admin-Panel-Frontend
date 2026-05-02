import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface Order {
  orderItemId: number;
  // customerId: number;
  customerName: string;
  email: string;
  phone: string;
  //   address: string;
  totalAmount: number;
  //   status: string;
  createdAt: string;
  //   productId: number;
  productName: string;
  productImage: string;
  price: number;
  variantValue: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/payment");
        setOrders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-10">No orders found.</p>;
  }

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <span className="text-2xl sm:text-3xl font-bold mb-6 text-center block">
        Orders
      </span>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Order Item ID
              </th>
              {/* <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Customer ID
              </th> */}
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Phone
              </th>
              {/* <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Total Amount
              </th> */}
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Individual Amount
              </th>
              <th className="hidden md:table-cell px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Ordered At
              </th>
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Product Name
              </th>
              {/* <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Variant Name
              </th> */}
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Product Image
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderItemId} className="border-t">
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.orderItemId}
                </td>
                {/* <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.customerId}
                </td> */}
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.customerName}
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.email}
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.phone}
                </td>
                {/* <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  ₹{order.totalAmount}
                </td> */}
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  ₹{order.price}
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.productName.slice(0, 20)}
                </td>
                {/* <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {order.variantValue}
                </td> */}
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
