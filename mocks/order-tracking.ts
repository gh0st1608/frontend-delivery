export const orderTrackingMock = {
  orderId: "ORDER-123",
  status: "Delivered",
  steps: [
    {
      key: "received",
      title: "Order Received",
      time: "Nov 23, 2021 - 6:30 PM",
      completed: true,
    },
    {
      key: "confirmed",
      title: "Order Confirmed",
      time: "Nov 23, 2021 - 6:30 PM",
      completed: true,
    },
    {
      key: "processed",
      title: "Order Processed",
      time: "Nov 23, 2021 - 6:35 PM",
      completed: true,
    },
    {
      key: "delivered",
      title: "Delivered",
      time: "Nov 23, 2021 - 6:20 PM",
      completed: true,
    },
  ],
};
