var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const getDynamicVenue = (venue_slug) => __awaiter(void 0, void 0, void 0, function* () {
    const dynamic_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/dynamic`;
    try {
        const response = yield axios.get(dynamic_base_url);
        const data = response.data;
        const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const base_price = data.venue_raw.delivery_specs.delivery_pricing.base_price;
        const distance_ranges = data.venue_raw.delivery_specs.delivery_pricing.distance_ranges;
        let dynamic_venue_data = {
            order_minimum_no_surcharge,
            base_price,
            distance_ranges
        };
        return dynamic_venue_data;
    }
    catch (error) {
        console.error("Error fetching dynamic venue data", error);
    }
});
const getStaticVenue = (venue_slug) => __awaiter(void 0, void 0, void 0, function* () {
    const static_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/static`;
    try {
        const response = yield axios.get(static_base_url);
        const data = response.data;
        const coordinates = data.venue_raw.location.coordinates;
        const static_venue_data = {
            coordinates
        };
        return static_venue_data;
    }
    catch (error) {
        console.error("Error fetching static venue data", error);
    }
});
const calculateDistance = (user_lat, user_lon, venue_lat, venue_lon) => {
    const R = 6371e3;
    const toRadians = (deg) => deg * Math.PI / 180;
    const phi1 = toRadians(user_lat);
    const phi2 = toRadians(venue_lat);
    const deltaPhi = toRadians(venue_lat - user_lat);
    const deltaLambda = toRadians(venue_lon - user_lon);
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};
const calculateSmallOrderSurcharge = (order_minimum_no_surcharge, cart_value) => {
    let small_order_surcharge = order_minimum_no_surcharge - cart_value;
    if (small_order_surcharge < 0) {
        small_order_surcharge = 0;
    }
    return small_order_surcharge;
};
export { getDynamicVenue, getStaticVenue, calculateDistance, calculateSmallOrderSurcharge };
