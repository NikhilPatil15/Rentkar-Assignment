import mongoose, { model, Schema } from "mongoose";
import { AssignmentTypes } from "../types/assignment.type";

const assignmentSchema = new mongoose.Schema<AssignmentTypes>({
    orderId:{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    partnerId:{
        type:Schema.Types.ObjectId,
        ref:'DeliveryPartner',
        required:true
    },
    timestamp:{
        type:Date,
        required:true,
        default:Date.now  
    },
    status:{    
        type:String,
        enum:["success","failed"]
    },
    reason:{
        type:String
    }

},{timestamps:true})

const Assignment = model<AssignmentTypes>('Assignment',assignmentSchema)

export default Assignment