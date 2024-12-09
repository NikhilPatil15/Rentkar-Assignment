import { Router } from "express";

const assignmentRouter = Router()

assignmentRouter.route('/assignments/metrics').get()

assignmentRouter.route('/assignments/run').post()


export default assignmentRouter