import express, {Request, Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"


const app = express();
app.use(cors());
const port = 3000;

const static_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static";
const dynamic_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic";
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from typescript")
})


interface Delivery {
    fee: number,
    distance: number
}

const total_price: number = 0
const small_order_surcharge: number = 0
const cart_value: number = 0
const fee: number = 0
const distance: number = 0

const delivery: Delivery = {
    "fee": fee,
    "distance": distance
}


app.get("/api/v1/delivery-order-price", async (req: Request, res: Response) => {
    const {venue_slug, cart_value, user_lat, user_lon} = req.params;
    try {
        try{
            const response = await axios.get(static_base_url);
            const data = await response.data;
            const coordinates = data.venue_raw.location.coordinates
            console.log(coordinates)
            // console.log(data)
        } catch(error) {

        }
        try {
            const response = await axios.get(BASE_URL);

        } catch(error) {

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