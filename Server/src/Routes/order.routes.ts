import {Router} from 'express'
import { changeOrderStatus, createOrder, getAllOrders, getOrderById } from '../Controllers/order.controller'
import { assignOrder } from '../Controllers/assignment.controller'

const orderRouter = Router()

orderRouter.route("/orders").get(getAllOrders)

orderRouter.route('/orders/assign').post(assignOrder)

orderRouter.route('/orders').post(createOrder)

orderRouter.route('/orders/:orderId/status').put(changeOrderStatus)

orderRouter.route('/orders/:orderId/single-order').get(getOrderById)

export default orderRouter