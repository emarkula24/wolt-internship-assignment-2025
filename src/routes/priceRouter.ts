import Router from "express"
import { getDeliveryOrderPrice } from "../controllers/priceController.js"
const router = Router()

router.get("/", getDeliveryOrderPrice)

export default router;