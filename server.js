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
const calculate_small_order_surcharge_1 = __importDefault(require("./Calculators/calculate_small_order_surcharge"));
const calculate_distance_1 = __importDefault(require("./Calculators/calculate_distance"));
const calculate_fee_1 = __importDefault(require("./Calculators/calculate_fee"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3000;
const static_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static";
const dynamic_base_url = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic";
app.get("/", (req, res) => {
    res.send("Hello from typescript");
});
let total_price = 0;
let small_order_surcharge = 0;
let cart_value = 0;
let fee = 0;
let distance = 0;
const delivery = {
    "fee": fee,
    "distance": distance
};
function getStaticVenue() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(static_base_url);
            const data = yield response.data;
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
}
function getDynamicVenue() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(dynamic_base_url);
            const data = yield response.data;
            const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
            const base_price = data.venue_raw.delivery_specs.base_price;
            const distance_ranges = data.venue_raw.delivery_specs.distance_ranges;
            let dynamic_venue_data = {
                order_minimum_no_surcharge,
                base_price,
                distance_ranges
            };
            return dynamic_venue_data;
        }
        catch (error) {
            console.error("Error fetchin dynamic venue data", error);
        }
    });
}
// interface OrderParameters {
//     venue_slug: string,
//     cart_value: number,
//     user_lat: number,
//     user_lon: number
// }
app.get("/api/v1/delivery-order-price", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { venue_slug, cart_value, user_lat, user_lon } = req.params;
    try {
        const { coordinates } = (yield getStaticVenue()) || {};
        const { order_minimum_no_surcharge, base_price, distance_ranges } = (yield getDynamicVenue()) || {};
        const small_order_surcharge = (0, calculate_small_order_surcharge_1.default)(order_minimum_no_surcharge, cart_value);
        fee = (0, calculate_fee_1.default)(distance, distance_ranges, base_price);
        delivery.distance = (0, calculate_distance_1.default)(user_lat, user_lon, coordinates[0], coordinates[1]);
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
}));
app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
});
