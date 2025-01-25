var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDynamicVenue, getStaticVenue, calculateDistance, calculateSmallOrderSurcharge } from "../services/venueService.js";
const getDeliveryOrderPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let total_price = 0;
    let small_order_surcharge = 0;
    let fee = 0;
    let distance = 0;
    const { venue_slug, cart_value: raw_cart_value, user_lat: raw_user_lat, user_lon: raw_user_lon } = req.query;
    const cart_value = parseFloat(raw_cart_value);
    const user_lat = parseFloat(raw_user_lat);
    const user_lon = parseFloat(raw_user_lon);
    try {
        const [staticVenueData, dynamicVenueData] = yield Promise.all([
            getStaticVenue(venue_slug),
            getDynamicVenue(venue_slug)
        ]);
        if (!staticVenueData || !dynamicVenueData) {
            throw new Error("Failed to fetch venue data.");
        }
        const { coordinates } = staticVenueData || {};
        const venue_lat = coordinates[1];
        const venue_lon = coordinates[0];
        const { order_minimum_no_surcharge, base_price, distance_ranges } = dynamicVenueData || {};
        small_order_surcharge = calculateSmallOrderSurcharge(order_minimum_no_surcharge, cart_value);
        distance = calculateDistance(user_lat, user_lon, venue_lat, venue_lon);
        for (const object of distance_ranges) {
            if (distance >= object.min && distance <= object.max) {
                fee = base_price + object.a + (object.b * distance / 10);
                break;
            }
            else if (distance >= object.min && object.max === 0) {
                res.status(400).json({ error: "Delivery distance is too long" });
            }
        }
        total_price = fee + small_order_surcharge + cart_value;
        const delivery = {
            "fee": fee,
            "distance": distance
        };
        res.status(200).json({
            "total_price": total_price,
            "small_order_surcharge": small_order_surcharge,
            "cart_value": cart_value,
            "delivery": delivery
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to calculate order-price" });
    }
});
export { getDeliveryOrderPrice };
