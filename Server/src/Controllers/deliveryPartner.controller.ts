import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import { ErrorResponse } from "../Utils/ErrorResponse";
import DeliveryPartner from "../Models/deliveryPartner.model";
import { SuccessResponse } from "../Utils/SuccessResponse";
import { CallbackError } from "mongoose";

const createDeliveryPartner = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, areas, shift } = req.body;

    if (
      [name, email, phone, areas, shift].some((value) => value.trim() === "")
    ) {
      throw new ErrorResponse(400, "All fields are required!");
    }

    if (areas.length === 0) {
      throw new ErrorResponse(400, "At least one area is must!");
    }

    const alreadyExist = await DeliveryPartner.findOne({ email: email });

    if (
      alreadyExist &&
      alreadyExist.phone === phone &&
      alreadyExist.name === name
    ) {
      throw new ErrorResponse(400, "Delivery partner already exists!");
    }

    try {
      const partner = await DeliveryPartner.create({
        name: name,
        email: email,
        phone: phone,
        areas: areas,
        shift: shift,
      });

      return res.json(
        new SuccessResponse(
          200,
          partner,
          "Delivery Partner created successfully!"
        )
      );
    } catch (error: any) {
      console.log(`Error while creating partner: ${error?.message}`);
    }
  }
);

const getAllDeliveryPartners = asyncHandler(async (req:Request,res:Response) => {
    const partners = await DeliveryPartner.find()

    if(partners.length === 0){
        throw new ErrorResponse(400,"Partners does not exist!")
    }

    return res.json(new SuccessResponse(200,partners,"All delivery partners fetched successfully!"))
})

const updateDeliveryPartner = asyncHandler(async (req:Request, res:Response) => {
    const {areas,shift,name,email,phone, status} = req.body
    const {partnerId} = req.params

    const partner = await DeliveryPartner.findById(partnerId)

    if(!partner){
        throw new ErrorResponse(400,"Partner does not exist!")
    }

    partner.areas = areas ? areas : partner?.areas
    partner.shift = shift ? shift : partner?.shift
    partner.name = name? name : partner?.name,
    partner.email = email? email : partner?.email
    partner.phone = phone ? phone : partner?.phone
    partner.status = status ? status : partner?.status

    await partner.save({validateBeforeSave:false})

    return res.json(new SuccessResponse(200,partner,"Partner details changed successfully!"))

})

const deleteDeliveryPartner = asyncHandler(async (req:Request, res:Response) => {
    const {partnerId} = req.params

    const partner = await DeliveryPartner.findById(partnerId)

    if(!partner){
        throw new ErrorResponse(400,"Partner does not exist!")
    }

    await partner.deleteOne()

    return res.json(new SuccessResponse(200,"Delivery Partner deleted successfully!"))

})

export {
    createDeliveryPartner,
    getAllDeliveryPartners,
    updateDeliveryPartner,
    deleteDeliveryPartner
}