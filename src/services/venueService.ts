import axios from "axios";

interface Ranges {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
}
interface VenueData {
    orderMinimumNoSurcharge: number;
    basePrice: number;
    distanceRanges: Ranges[];
    coordinates: number[];
}

const getVenues = async (venueSlug: string) => {

    if (!venueSlug) {
        throw new Error ("Invalid venue_slug")
    }
    const dynamicBaseUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;
    const staticBaseUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
    try {
        const [dynamicResponse, staticResponse] = await Promise.all([
            axios.get(dynamicBaseUrl),
            axios.get(staticBaseUrl)
        ]);
        
        const dynamicData = dynamicResponse.data;
        const orderMinimumNoSurcharge = dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const basePrice = dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
        const distanceRanges = dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

        const staticData = staticResponse.data;
        const coordinates = staticData.venue_raw.location.coordinates;

        
        const venueData: VenueData= {
            orderMinimumNoSurcharge,
            basePrice,
            distanceRanges,
            coordinates
        };

        return venueData;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to get venue data: " + error.message)
        }
    }
}


const calculateDistance = (userLat: number, userLon: number, venueLat: number, venueLon: number) => {

    if (isNaN(userLat)) {
        throw new Error("Invalid user_lat");
    }
    
    if (isNaN(userLon)) {
        throw new Error("Invalid user_lon");
    }

    const R = 6371e3; 
    const toRadians = (deg: number) => deg * Math.PI / 180;
    
    const phi1 = toRadians(userLat);
    const phi2 = toRadians(venueLat);
    const deltaPhi = toRadians(venueLat - userLat);
    const deltaLambda = toRadians(venueLon - userLon);

    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(R * c);
}

const calculateSmallOrderSurcharge = (orderMinimumNoSurcharge: number, cartValue: number) => {
    if (isNaN(cartValue) || cartValue < 0) {
        console.log("cart")
        throw new Error("Invalid cart_value")
    }
    let smallOrderSurcharge = orderMinimumNoSurcharge - cartValue;
    if(smallOrderSurcharge < 0) {
        smallOrderSurcharge = 0;
    }
    return smallOrderSurcharge;
}

interface DopcQueryParams {
    venue_slug: string;
    cart_value: string; 
    user_lat: string;
    user_lon: string;
}

interface ParsedDopcParams {
    venueSlug: string;
    cartValue: number;
    userLat: number;
    userLon: number;
}

const parseParameters = (params: { query: DopcQueryParams }) => {

    const {venue_slug: venueSlug,
        cart_value: cartValue, 
        user_lat: userLat,
        user_lon: userLon
    } = params.query;

    const userData: ParsedDopcParams = {
        venueSlug,
        cartValue: parseFloat(cartValue),
        userLat: parseFloat(userLat),
        userLon: parseFloat(userLon)
    };

    return userData;
}

const calculateDeliveryFee = (distanceRanges: Ranges[], basePrice: number, distance: number) => {
    let total = 0;
    for (const range of distanceRanges) {
        if (distance >= range.min && distance <= range.max) {
            total = basePrice + range.a + (range.b * distance / 10);
            return total;
        }
        else if (distance >= range.min && distance < range.max || range.max === 0) {
            throw new Error("Delivery distance is too long")
        }
    }
}
export { getVenues, calculateDistance, calculateSmallOrderSurcharge, calculateDeliveryFee, parseParameters, DopcQueryParams }