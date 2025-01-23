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
const calculate_small_order_surcharge_1 = __importDefault(require("./Calculators/calculate_small_order_surcharge"));
const calculate_distance_1 = __importDefault(require("./Calculators/calculate_distance"));
const get_static_venue_1 = __importDefault(require("./API/get_static_venue"));
const get_dynamic_venue_1 = __importDefault(require("./API/get_dynamic_venue"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3000;
app.get("/api/v1/delivery-order-price", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let total_price = 0;
    let small_order_surcharge = 0;
    let fee = 0;
    let distance = 0;
    const { venue_slug, cart_value: raw_cart_value, user_lat: raw_user_lat, user_lon: raw_user_lon } = req.query;
    const cart_value = parseFloat(raw_cart_value);
    const user_lat = parseFloat(raw_user_lat);
    const user_lon = parseFloat(raw_user_lon);
    try {
        const { coordinates } = (yield (0, get_static_venue_1.default)(venue_slug)) || {};
        const { order_minimum_no_surcharge, base_price, distance_ranges } = (yield (0, get_dynamic_venue_1.default)(venue_slug)) || {};
        small_order_surcharge = (0, calculate_small_order_surcharge_1.default)(order_minimum_no_surcharge, cart_value);
        distance = (0, calculate_distance_1.default)(user_lat, user_lon, coordinates[1], coordinates[0]);
        for (const object of distance_ranges) {
            if (distance >= object.min && distance <= object.max) {
                fee = base_price + object.a + (object.b * distance / 10);
                break;
            }
            else if (distance >= object.min && object.max === 0) {
                res.status(400).json({ error: "Delivery distance is too long" });
            }
        }
        total_price = fee + small_order_surcharge + cart_value;
        const delivery = {
            "fee": fee,
            "distance": distance
        };
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
