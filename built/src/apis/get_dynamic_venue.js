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
export default function getDynamicVenue(venue_slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const dynamic_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/dynamic`;
        try {
            const response = yield axios.get(dynamic_base_url);
            const data = response.data;
            const order_minimum_no_surcharge = data.venue_raw.delivery_specs.order_minimum_no_surcharge;
            const base_price = data.venue_raw.delivery_specs.delivery_pricing.base_price;
            const distance_ranges = data.venue_raw.delivery_specs.delivery_pricing.distance_ranges;
            let dynamic_venue_data = {
                order_minimum_no_surcharge,
                base_price,
                distance_ranges
            };
            return dynamic_venue_data;
        }
        catch (error) {
            console.error("Error fetching dynamic venue data", error);
        }
    });
}
