import express, {Request, Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import calculate_small_order_surcharge from "./Calculators/calculate_small_order_surcharge";
import calculate_distance from "./Calculators/calculate_distance";
import getStaticVenue from "./API/get_static_venue";
import getDynamicVenue from "./API/get_dynamic_venue";

const app = express();
app.use(cors());
const port = 3000;

interface Ranges {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
  }
app.get("/api/v1/delivery-order-price", async (req: Request, res: Response) => {

    let total_price: number = 0;
    let small_order_surcharge: number = 0;
    let fee: number = 0;
    let distance: number = 0;
    
    const {venue_slug,
        cart_value: raw_cart_value, 
        user_lat: raw_user_lat,
        user_lon: raw_user_lon
    } = req.query as {venue_slug: string, cart_value: string, user_lat: string, user_lon: string};
    
    
    const cart_value = parseFloat(raw_cart_value)
    const user_lat = parseFloat(raw_user_lat)
    const user_lon = parseFloat(raw_user_lon)
    
    try {
        const { coordinates} = await getStaticVenue(venue_slug) || {}
        const { order_minimum_no_surcharge, base_price, distance_ranges } = await getDynamicVenue(venue_slug) || {}
        small_order_surcharge = calculate_small_order_surcharge(order_minimum_no_surcharge , cart_value);
        distance = calculate_distance(user_lat, user_lon, coordinates[1], coordinates[0]);

        for (const object of distance_ranges as Ranges[]) {
            if (distance >= object.min && distance <= object.max) {
                fee = base_price + object.a + (object.b * distance / 10);
                break;
            }
            else if (distance >= object.min && object.max === 0) {
                res.status(400).json({error: "Delivery distance is too long"})
            }
        }
        
        total_price = fee + small_order_surcharge + cart_value;
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