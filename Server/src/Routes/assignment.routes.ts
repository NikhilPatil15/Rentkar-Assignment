import { Router } from "express";
import { getAssignmentMetrics } from "../Controllers/assignment.controller";

const assignmentRouter = Router()

assignmentRouter.route('/assignments/metrics').get(getAssignmentMetrics)

assignmentRouter.route('/assignments/run').post()


export default assignmentRouter