import axios from "axios";

interface Ranges {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
}

interface DynamicVenueData {
    order_minimum_no_surcharge: number;
    base_price: number;
    distance_ranges: Ranges[];
}

const getDynamicVenue = async (venue_slug: string) => {
    const dynamic_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/dynamic`;
    try {
        const response = await axios.get(dynamic_base_url);
        const data = response.data;
        const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const base_price = data.venue_raw.delivery_specs.delivery_pricing.base_price;
        const distance_ranges = data.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

        let dynamic_venue_data: DynamicVenueData = {
            order_minimum_no_surcharge,
            base_price,
            distance_ranges
        }
        return  dynamic_venue_data;

    } catch (error) {
        console.error("Error fetching dynamic venue data", error)
    }
}

interface StaticVenueData {
    coordinates: number[]
}

const getStaticVenue = async (venue_slug: string)  => {
    const static_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/static`;

    try{
        const response = await axios.get(static_base_url);
        const data = response.data;
        const coordinates = data.venue_raw.location.coordinates
        const static_venue_data: StaticVenueData = {
            coordinates
        }
        return static_venue_data

    } catch(error) {
        console.error("Error fetching static venue data", error)
    }
}

const calculateDistance = (user_lat: number, user_lon: number, venue_lat: number, venue_lon: number) => {

    const R = 6371e3; 
    const toRadians = (deg: number) => deg * Math.PI / 180;
    
    const phi1 = toRadians(user_lat);
    const phi2 = toRadians(venue_lat);
    const deltaPhi = toRadians(venue_lat - user_lat);
    const deltaLambda = toRadians(venue_lon - user_lon);

    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

const calculateSmallOrderSurcharge = (order_minimum_no_surcharge: number, cart_value: number) => {
    let small_order_surcharge = order_minimum_no_surcharge - cart_value;
    if(small_order_surcharge < 0) {
        small_order_surcharge = 0;
    }
    return small_order_surcharge;
}
export { getDynamicVenue, getStaticVenue, calculateDistance, calculateSmallOrderSurcharge }