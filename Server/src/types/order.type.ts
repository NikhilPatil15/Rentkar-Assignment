export type OrderTypes = {
    orderNumber: string;
    customer: { name: string; phone: string; address: string };
    area: string;
    items: { name: string; quantity: number; price: number }[];
    status: "pending" | "assigned" | "picked" | "delivered";
    scheduledFor: string;
  };
  