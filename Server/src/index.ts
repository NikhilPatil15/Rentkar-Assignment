import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./Database/databaseConnection";

const app = express();

dotenv.config({ path: "./.env" });

connectDatabase().then(() => {
  console.log("Database connected successfully!");
});

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Rentkar Assignment Backend!");
});

import orderRouter from "./Routes/order.routes";
import deliveryPartnerRouter from "./Routes/deliveryPartner.routes";
import assignmentRouter from "./Routes/assignment.routes";

app.use("/api", orderRouter);
app.use("/api", deliveryPartnerRouter);
app.use("/api", assignmentRouter);
