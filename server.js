"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3000;
const BASE_URL = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static";
app.get("/", (req, res) => {
    res.send("Hello from typescript");
});
const total_price = 0;
const small_order_surcharge = 0;
const cart_value = 0;
const fee = 0;
const distance = 0;
const delivery = {
    "fee": fee,
    "distance": distance
};
app.get("/api/v1/delivery-order-price", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { venue_slug, cart_value, user_lat, user_lon } = req.params;
    try {
        try {
            const response = yield axios_1.default.get(BASE_URL);
            const data = yield response.data;
            const coordinates = data.venue_raw.location.coordinates;
            console.log(coordinates);
            // console.log(data)
        }
        catch (error) {
        }
        res.status(200).json({
            "total_price": total_price,
            "small_order_surcharge": small_order_surcharge,
            "cart_value": cart_value,
            "delivery": delivery
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to calculate order-price" });
    }
}));
app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
});
