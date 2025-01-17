import express, {Request, Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"
import calculate_small_order_surcharge from "./Calculators/calculate_small_order_surcharge";
import calculate_distance from "./Calculators/calculate_distance";
import calculate_fee from "./Calculators/calculate_fee";

const app = express();
app.use(cors());
const port = 3000;

const static_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static";
const dynamic_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic";
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from typescript")
})




let total_price: number = 0;
let small_order_surcharge: number = 0;
let cart_value: number = 0;
let fee: number = 0;
let distance: number = 0;

async function getStaticVenue() {
    try{
        const response = await axios.get(static_base_url);
        const data = response.data;
        const coordinates = data.venue_raw.location.coordinates
        const static_venue_data = {
            coordinates
        }
        return static_venue_data

    } catch(error) {
        console.error("Error fetching static venue data", error)
    }
}

async function getDynamicVenue(){

    interface VenueData {
        order_minimum_no_surcharge: number;
        base_price: number;
        distance_ranges: any[];
    }

    try {
        const response = await axios.get(dynamic_base_url);
        const data = response.data;
        const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
        const base_price = data.venue_raw.delivery_specs.base_price;
        const distance_ranges = data.venue_raw.delivery_specs.distance_ranges;

        let dynamic_venue_data: VenueData = {
            order_minimum_no_surcharge,
            base_price,
            distance_ranges
        }
        return  dynamic_venue_data;

    } catch (error) {
        console.error("Error fetchin dynamic venue data", error)
    }
}

interface OrderParameters {
    venue_slug: string;
    cart_value: number;
    user_lat: number;
    user_lon: number;
}

app.get("/api/v1/delivery-order-price", async (req: Request, res: Response) => {
    const {venue_slug, cart_value, user_lat, user_lon} = req.params;
    try {
        const { coordinates } = await getStaticVenue() || {}
        const { order_minimum_no_surcharge, base_price, distance_ranges } = await getDynamicVenue() || {}
        const small_order_surcharge = calculate_small_order_surcharge(order_minimum_no_surcharge ?? 0, cart_value ?? 0);

        fee = calculate_fee(distance, distance_ranges, base_price);
        distance = calculate_distance(user_lat, user_lon, coordinates[0], coordinates[1]);

        const delivery = {
            "fee": fee,
            "distance": distance
        }

        res.status(200).json({
            "total_price": total_price,
            "small_order_surcharge": small_order_surcharge,
            "cart_value": cart_value,
            "delivery": delivery
        })

    } catch (error) {
        res.status(500).json({error: "Failed to calculate order-price"})
    }
})
app.listen(port, () => {
    console.log(`The application is listening on port ${port}`)
});