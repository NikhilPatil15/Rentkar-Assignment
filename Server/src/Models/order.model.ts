import mongoose, { CallbackError, Document, model } from "mongoose";
import { OrderTypes } from "../types/order.type";

interface OrderInterface extends OrderTypes, Document {}

const orderSchema = new mongoose.Schema<OrderInterface>(
  {
    orderNumber: {
      type: String,
      unique: true,
      required:true
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    area: {
      type: String,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "assigned", "picked", "delivered"],
      default: "pending",
      required: true,
    },
    scheduledFor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", async function (next) {
  const order = this as OrderInterface;

  if (!order.isNew) return next();

  try {
    const lastOrder = await mongoose
      .model<OrderInterface>("Order")
      .findOne()
      .sort({ createdAt: -1 });

    let newOrderNumber = 1;
    if (lastOrder?.orderNumber) {
      const lastNumber = parseInt(lastOrder.orderNumber.replace("ORD", ""), 10);
      newOrderNumber = lastNumber + 1;
    }

    /* order number as ORD00001, ORD00002 */
    order.orderNumber = `ORD${String(newOrderNumber).padStart(5, "0")}`;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

const Order = model<OrderInterface>("Order", orderSchema);

export default Order;
