var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from "chai";
const base_url = "http://localhost:8000";
describe("GET /api/v1/delivery-order-price", () => {
    it("should return expected response with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
        const venue_slug = "home-assignment-venue-helsinki";
        const cart_value = "1000";
        const user_lat = 60.17094;
        const user_lon = 24.93087;
        const response = yield fetch(`
                ${base_url}/api/v1/delivery-order-price?venue_slug=${venue_slug}&cart_value=${cart_value}&user_lat=${user_lat}&user_lon=${user_lon}
            `);
        if (!response.ok) {
            throw new Error();
        }
        const data = yield response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an("object");
        expect(data).to.have.all.keys("total_price", "small_order_surcharge", "cart_value", "delivery");
        expect(data.delivery).to.have.all.keys("fee", "distance");
        expect(data.total_price).to.equal(1190);
        expect(data.small_order_surcharge).to.equal(0);
        expect(data.cart_value).to.equal(1000);
        expect(data.delivery.fee).to.equal(190);
        expect(data.delivery.distance).to.equal(177);
    }));
});
