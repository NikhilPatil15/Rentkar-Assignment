import express, { Request,Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'


const app = express()

dotenv.config({path:'./.env'})

app.use(cors({origin:process.env.CORS_ORIGIN}))

app.use(express.json())


const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
})

app.get("/",(req:Request,res:Response)=>{
    res.send("Rentkar Assignment Backend!")
})

