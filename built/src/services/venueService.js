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
const getVenues = (venueSlug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!venueSlug) {
        throw new Error("Invalid venue_slug");
    }
    const dynamicBaseUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;
    const staticBaseUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
    try {
        const [dynamicResponse, staticResponse] = yield Promise.all([
            axios.get(dynamicBaseUrl),
            axios.get(staticBaseUrl)
        ]);
        const dynamicData = dynamicResponse.data;
        const orderMinimumNoSurcharge = dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const basePrice = dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
        const distanceRanges = dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;
        const staticData = staticResponse.data;
        const coordinates = staticData.venue_raw.location.coordinates;
        const venueData = {
            orderMinimumNoSurcharge,
            basePrice,
            distanceRanges,
            coordinates
        };
        return venueData;
    }
    catch (error) {
        return null;
    }
});
const calculateDistance = (userLat, userLon, venueLat, venueLon) => {
    if (!userLat) {
        throw new Error("Invalid user_lat");
    }
    if (!userLon) {
        throw new Error("Invalid user_lon");
    }
    const R = 6371e3;
    const toRadians = (deg) => deg * Math.PI / 180;
    const phi1 = toRadians(userLat);
    const phi2 = toRadians(venueLat);
    const deltaPhi = toRadians(venueLat - userLat);
    const deltaLambda = toRadians(venueLon - userLon);
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};
const calculateSmallOrderSurcharge = (orderMinimumNoSurcharge, cartValue) => {
    if (!cartValue) {
        throw new Error("Invalid cart_value");
    }
    let smallOrderSurcharge = orderMinimumNoSurcharge - cartValue;
    if (smallOrderSurcharge < 0) {
        smallOrderSurcharge = 0;
    }
    return smallOrderSurcharge;
};
const parseParameters = (params) => {
    const { venue_slug: venueSlug, cart_value: cartValue, user_lat: userLat, user_lon: userLon } = params.query;
    const userData = {
        venueSlug,
        cartValue: parseFloat(cartValue),
        userLat: parseFloat(userLat),
        userLon: parseFloat(userLon)
    };
    return userData;
};
const calculateDeliveryFee = (distanceRanges, basePrice, distance) => {
    let total = 0;
    for (const range of distanceRanges) {
        if (distance >= range.min && distance <= range.max) {
            total = basePrice + range.a + (range.b * distance / 10);
            return total;
        }
        else if (distance >= range.min && distance < range.max || range.max === 0) {
            return -1;
        }
    }
};
export { getVenues, calculateDistance, calculateSmallOrderSurcharge, calculateDeliveryFee, parseParameters };
