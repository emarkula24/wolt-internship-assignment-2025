import Router from "express"
import { getDeliveryOrderPrice } from "../controllers/priceController.js"
import { errorHandler } from "../middlewares/errorHandler.js"
const priceRouter = Router()

priceRouter.get("/", getDeliveryOrderPrice)



export default priceRouter;