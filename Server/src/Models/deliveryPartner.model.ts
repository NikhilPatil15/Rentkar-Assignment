import mongoose, { model } from "mongoose";
import { DeliveryPartnerTypes } from "../types/deliveryPartner.type";


const deliveryPartnerSchema = new mongoose.Schema<DeliveryPartnerTypes>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default:"inactive"
    },
    currentLoad: {
      type: Number,
      default:0
    },
    areas: {
      type: [String],
      required: true,
    },
    shift: {
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },
    metrics: {
      rating: Number,
      completedOrders: Number,
      cancelledOrders: Number,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartner = model<DeliveryPartnerTypes>("DeliveryPartner",deliveryPartnerSchema)

export default DeliveryPartner