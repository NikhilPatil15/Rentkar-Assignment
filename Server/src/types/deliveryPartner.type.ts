export type DeliveryPartnerTypes = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number; // max: 3
  areas: string[];
  shift: {
    start: string;
    end: string;
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
};
