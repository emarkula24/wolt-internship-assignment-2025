import axios from "axios";

export default async function getDynamicVenue(venue_slug: string){


    
    const dynamic_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/dynamic`;
    try {
        const response = await axios.get(dynamic_base_url);
        const data = response.data;
        const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const base_price = data.venue_raw.delivery_specs.delivery_pricing.base_price;
        const distance_ranges = data.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

        let dynamic_venue_data = {
            order_minimum_no_surcharge,
            base_price,
            distance_ranges
        }
        return  dynamic_venue_data;

    } catch (error) {
        console.error("Error fetching dynamic venue data", error)
    }
}