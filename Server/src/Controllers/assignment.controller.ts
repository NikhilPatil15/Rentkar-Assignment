import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import { ErrorResponse } from "../Utils/ErrorResponse";
import Order from "../Models/order.model";
import DeliveryPartner from "../Models/deliveryPartner.model";
import Assignment from "../Models/assignment.model";
import { SuccessResponse } from "../Utils/SuccessResponse";

/* order assigning controller */
const assignOrder = asyncHandler(async (req: Request, res: Response) => {

  /* Short Algo
  1.First check if the orderId and the PartnerId both are present if not then send an error response
  2.Then check if the order with the given orderId is present or not. if not then send an error response
  3.Once again check if the delivery partner with given partnerId is present or not.if not the send and error response
  4.Now check if the shift of the partner matches with the time 
  5.check if the delivery partner has that specified area 
  6.check if the currenLoad of the partner is not more than 3 or equal to 3 
  7.change the order status to assigned and increase the current load of the delivery partner  
  */
  const { orderId, partnerId } = req.body;

  if ([orderId, partnerId].some((value) => value.trim() === "")) {
    throw new ErrorResponse(400, "All fields are necessary!");
  }

  const order = await Order.findById(orderId);
  const partner = await DeliveryPartner.findById(partnerId);

  if (!order) {
    throw new ErrorResponse(400, "Order does not exist!");
  }

  if (!partner) {
    throw new ErrorResponse(400, "Delivery Partner does not exist!");
  }

  const currentTime:Date = new Date();
  const currentHour:number = currentTime.getHours();

  const shiftStart = +partner.shift.start
  const shiftEnd = +partner.shift.end
  
  
  const isShiftMatch = currentHour >= shiftStart && currentHour <= shiftEnd;

  if (!isShiftMatch) {
    // Log failed assignment due to shift mismatch
    const failedAssignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Delivery partner not available during this time.",
    });

    return res
      .status(400)
      .json(
        new SuccessResponse(
          400,
          failedAssignment,
          "Failed to assign order: Delivery partner unavailable."
        )
      );
  }

  
  if (!partner.areas.includes(order.area)) {
    
    const failedAssignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Delivery partner does not serve the order's area.",
    });

    return res
      .status(400)
      .json(
        new SuccessResponse(
          400,
          failedAssignment,
          "Failed to assign order: Delivery partner does not serve this area."
        )
      );
  }

  const partnerCurretLoad:number = partner.currentLoad

  if(partnerCurretLoad >= 3){
    const assignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Partner load exceeded", 
    });

    return res.json(new SuccessResponse(200, assignment, "Assignment failed due to partner load"));
  }

  const assignment = await Assignment.create({
    orderId,
    partnerId,
    timestamp: currentTime,
    status: "success",
    reason: null,
  });

  partner.currentLoad += 1

  await partner.save()


  return res.json(
    new SuccessResponse(200, assignment, "Order successfully assigned.")
  );
});

export{
  assignOrder
}