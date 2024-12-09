import { Router } from "express";
import { createDeliveryPartner, deleteDeliveryPartner, getAllDeliveryPartners, updateDeliveryPartner } from "../Controllers/deliveryPartner.controller";


const deliveryPartnerRouter = Router()

deliveryPartnerRouter.route('/partners').get(getAllDeliveryPartners)

deliveryPartnerRouter.route('/partners').post(createDeliveryPartner)

deliveryPartnerRouter.route('/partners/:partnerId').put(updateDeliveryPartner)

deliveryPartnerRouter.route('/partners/:partnerId').delete(deleteDeliveryPartner)

export default deliveryPartnerRouter