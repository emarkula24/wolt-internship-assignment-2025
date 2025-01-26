var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getVenues, calculateDistance, calculateSmallOrderSurcharge, calculateDeliveryFee, parseParameters } from "../services/venueService.js";
const getDeliveryOrderPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let totalPrice = 0;
        let smallOrderSurcharge = 0;
        let distance = 0;
        const queryParams = req.query;
        const userData = parseParameters({ query: queryParams });
        const venueData = yield getVenues(userData.venueSlug);
        if (venueData === null) {
            throw new Error("Venue data not found");
        }
        smallOrderSurcharge = calculateSmallOrderSurcharge(venueData.orderMinimumNoSurcharge, userData.cartValue);
        distance = calculateDistance(userData.userLat, userData.userLon, venueData.coordinates[1], venueData.coordinates[0]);
        const fee = (_a = calculateDeliveryFee(venueData.distanceRanges, venueData.basePrice, distance)) !== null && _a !== void 0 ? _a : 0;
        if (fee === -1) {
            throw new Error("Delivery distance is too long");
        }
        totalPrice = fee + smallOrderSurcharge + userData.cartValue;
        const delivery = {
            "fee": fee,
            "distance": distance
        };
        res.status(200).json({
            "total_price": totalPrice,
            "small_order_surcharge": smallOrderSurcharge,
            "cart_value": userData.cartValue,
            "delivery": delivery
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
});
export { getDeliveryOrderPrice };
