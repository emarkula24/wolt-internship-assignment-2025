import express from "express"
import cors from "cors"
import priceRouter from "./routes/priceRouter.js"
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();
app.use(cors());
const port = 8000;

app.use("/api/v1/delivery-order-price", priceRouter);

app.use(errorHandler)

app.listen(port, () => {
    console.log(`The application is listening on port ${port}`)
});