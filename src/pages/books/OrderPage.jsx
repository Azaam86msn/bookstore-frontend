import React from 'react';
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <div>No orders found!</div>
      ) : (
        orders.map((order, index) => {
          // CSS class based on order status
          let statusClass;
          if (order.status === 'approved') {
            statusClass = 'text-green-600';
          } else if (order.status === 'denied') {
            statusClass = 'text-red-600';
          } else {
            statusClass = 'text-yellow-600';
          }

          // Status label element
          let statusLabel;
          if (order.status === 'approved') {
            statusLabel = (
              <Link to={`/read/${order.productIds[0]}`} className="text-blue-500 underline">
                Read Book
              </Link>
            );
          } else if (order.status === 'denied') {
            statusLabel = <span className="text-red-500">Order Denied</span>;
          } else {
            statusLabel = <span className="text-yellow-500">Pending Approval</span>;
          }

          return (
            <div key={order._id} className="border-b mb-4 pb-4">
              <p className="p-1 bg-secondary text-white w-10 rounded mb-1">#{index + 1}</p>
              <h2 className="font-bold">Order ID: {order._id}</h2>
              <p className="text-gray-600">Name: {order.name}</p>
              <p className="text-gray-600">Email: {order.email}</p>
              <p className="text-gray-600">Phone: {order.phone}</p>
              <p className="text-gray-600">Total Price: ${order.totalPrice}</p>

              <h3 className="font-semibold mt-2">Address:</h3>
              <p>
                {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
              </p>

              <h3 className="font-semibold mt-2">Order Status:</h3>
              <p className={`font-bold ${statusClass}`}>{order.status}</p>

              <h3 className="font-semibold mt-2">Products:</h3>
              <ul>
                {order.productIds.map((productId) => (
                  <li key={productId}>{statusLabel}</li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderPage;
