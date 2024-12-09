import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import { ErrorResponse } from "../Utils/ErrorResponse";
import Order from "../Models/order.model";
import { SuccessResponse } from "../Utils/SuccessResponse";

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  /* Short algo
  1.Check if all fields are given or not.
  2.Check the customer  object has all fields given if not then send error
  3.Check the items object has all fields given if not then send error and make sure that atleast one item is given from the body
  4.Check the scheduledFor date is not expired like it should be a date in the future
  5.if all validations are correct then create a document and send a success respose
  */

  const { customer, area, items, scheduledFor } = req.body;

  /* Check if all the fields are given or not  */
  if (
    [ area, scheduledFor].some((value) => value?.trim() === "")
  ) {
    throw new ErrorResponse(401, "All fields are necessary!");
  }

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    throw new ErrorResponse(
      400,
      "Customer name, phone, and address are required."
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ErrorResponse(400, "At least one item is required.");
  }

  for (const item of items) {
    if (!item.name || !item.quantity || !item.price) {
      throw new ErrorResponse(
        400,
        "Each item must have a name, quantity, and price."
      );
    }
    if (typeof item.quantity !== "number" || typeof item.price !== "number") {
      throw new ErrorResponse(400, "Item quantity and price must be numbers.");
    }
  }

  const scheduledDate = new Date(scheduledFor);
  const currentDate = new Date();

  if (scheduledDate < currentDate) {
    throw new ErrorResponse(400, "Scheduled time cannot be in the past.");
  }
  try {
    const newOrder = await Order.create({
      customer: customer,
      area: area,
      items: items,
      scheduledFor: scheduledFor,
    });

    res.json(new SuccessResponse(200, newOrder, "Order created Successfully!"));
  } catch (error: any) {
    throw new ErrorResponse(
      500,
      error?.message || "Something went wrong while creating order!"
    );
  }
});

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find();

  if (orders.length === 0) {
    throw new ErrorResponse(400, "No orders found!");
  }

  res.json(new SuccessResponse(200, orders, "Orders fetched successfully!"));
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ErrorResponse(400, "Order does not exist!");
  }

  res.json(new SuccessResponse(200, order, "Order fetched successfully!"));
});

const changeOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ErrorResponse(400, "Status is not given!");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status: status,
      },
    },
    { new: true }
  );

  if (!order) {
    throw new ErrorResponse(400, "Order does not exist!");
  }

  res.json(
    new SuccessResponse(200, order, "Order status updated successfully!")
  );
});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    changeOrderStatus
}