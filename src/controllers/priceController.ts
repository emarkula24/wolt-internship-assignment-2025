import { getVenues, calculateDistance, calculateSmallOrderSurcharge, calculateDeliveryFee, parseParameters , DopcQueryParams} from "../services/venueService.js";
import {Request, Response} from "express"


const getDeliveryOrderPrice = async (req: Request, res: Response) => {
    let totalPrice: number = 0;
    let smallOrderSurcharge: number = 0;
    let distance: number = 0;
    
    const queryParams = req.query as unknown as DopcQueryParams;
    const userData = parseParameters({ query: queryParams})
    
    try {

        const venueData = await getVenues(userData.venueSlug)

        if (!venueData) {
            throw new Error("Venue data not found");
        }

        smallOrderSurcharge = calculateSmallOrderSurcharge(venueData.orderMinimumNoSurcharge , userData.cartValue);
        distance = calculateDistance(userData.userLat, userData.userLon, venueData.coordinates[1], venueData.coordinates[0]);
        const fee = calculateDeliveryFee(res, venueData.distanceRanges, venueData.basePrice, distance) ?? 0;

        totalPrice = fee + smallOrderSurcharge + userData.cartValue;
        const delivery = {
            "fee": fee,
            "distance": distance
        }
        res.status(200).json({
            "total_price": totalPrice,
            "small_order_surcharge": smallOrderSurcharge,
            "cart_value": userData.cartValue,
            "delivery": delivery
        })

    } catch (error) {
        res.status(500).json({error: "Failed to calculate order-price"})
    }
}

export { getDeliveryOrderPrice }

