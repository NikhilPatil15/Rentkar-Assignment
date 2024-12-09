import { ObjectId } from "mongoose";

export type AssignmentTypes = {
  orderId: ObjectId;
  partnerId: ObjectId;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
};
