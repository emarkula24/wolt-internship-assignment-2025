import express from "express";
import cors from "cors";
import priceRouter from "./routes/priceRouter.js";
const app = express();
app.use(cors());
const port = 8000;
app.use("/api/v1/delivery-order-price", priceRouter);
app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
});
