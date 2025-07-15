import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";
import { MdIncompleteCircle } from "react-icons/md";
import RevenueChart from "./RevenueChart";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/features/orders/ordersApi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({});

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        });
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Fetch all orders (admin)
  const {
    data: orders = [],
    error: ordersError,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery();

  const [updateOrderStatusTrigger] = useUpdateOrderStatusMutation();

  // Approve / Deny handler
  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatusTrigger({ orderId, status }).unwrap();
      await refetchOrders();
      Swal.fire({
        icon: "success",
        title: `Order ${status}`,
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating order status", error);
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  if (loading) return <Loading />;

  // Extracted nested ternary into standalone variable
  let ordersContent;
  if (ordersLoading) {
    ordersContent = <p>Loading orders...</p>;
  } else if (ordersError) {
    ordersContent = <p className="text-red-500">Failed to load orders</p>;
  } else if (orders.length === 0) {
    ordersContent = <p>No orders found.</p>;
  } else {
    ordersContent = (
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Total Price</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">{order.name}</td>
              <td className="py-2 px-4 border-b">{order.email}</td>
              <td className="py-2 px-4 border-b">${order.totalPrice}</td>
              <td className="py-2 px-4 border-b capitalize">{order.status}</td>
              <td className="py-2 px-4 border-b">
                {order.status === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "approved")
                      }
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "denied")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Deny
                    </button>
                  </>
                ) : (
                  <span>No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {/* Dashboard Metrics */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
            {/* Icon omitted for brevity */}
          </div>
          <div>
            <span className="block text-2xl font-bold">
              {adminData?.totalBooks}
            </span>
            <span className="block text-gray-500">Products</span>
          </div>
        </div>
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
            {/* Icon omitted for brevity */}
          </div>
          <div>
            <span className="block text-2xl font-bold">
              ${adminData?.totalSales}
            </span>
            <span className="block text-gray-500">Total Sales</span>
          </div>
        </div>
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
            <MdIncompleteCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold">
              {adminData?.totalOrders}
            </span>
            <span className="block text-gray-500">Total Orders</span>
          </div>
        </div>
      </section>

      {/* Orders Management */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
        {ordersContent}
      </section>

      {/* Revenue Chart */}
      <section className="mt-8">
        <RevenueChart orders={orders} />
      </section>

      {/* Footer */}
      <section className="text-right font-semibold text-gray-500 mt-8">
        Developed by {" "}
        <a
          href="https://www.instagram.com/woodlandpublishinglk/"
          className="text-purple-600 hover:underline"
        >
          AadhilAzaamNuzky
        </a>{" "}
        - {" "}
        <a href="/" className="text-teal-400 hover:underline">
          WoodLand Publication
        </a>
      </section>
    </>
  );
};

export default Dashboard;
