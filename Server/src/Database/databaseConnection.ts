import mongoose from "mongoose";


export const connectDatabase = async () =>{
    try {

        

        /* Database connection */
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)

       
        console.log("Database connected successfully: ", connectionInstance.connection.host);
        
    } catch (error) {
        console.log(error);
        
        
        process.exit(1)
    }
}