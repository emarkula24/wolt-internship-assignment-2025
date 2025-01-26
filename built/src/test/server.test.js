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
const venueSlug = "home-assignment-venue-helsinki";
const cartValue = "1000";
const userLat = 60.17094;
const userLon = 24.93087;
describe("GET /api/v1/delivery-order-price", () => {
    it("should return expected response with example parameters", () => __awaiter(void 0, void 0, void 0, function* () {
        //"expected response" is the one described in the example of the application specifications.
        const response = yield fetch(`
                ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lat=${userLat}&user_lon=${userLon}
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
    it("should return error if venue distance is too long", () => __awaiter(void 0, void 0, void 0, function* () {
        const userLat = 60.22270244680721;
        const userLon = 24.860549295080748;
        const response = yield fetch(`
            ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lat=${userLat}&user_lon=${userLon}
        `);
        const data = yield response.json();
        expect(response.status).to.equal(400);
        expect(data).to.have.property("error");
        expect(data.error).to.equal("Delivery distance is too long");
    }));
    it("should return error if a required parameter is not present", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`
            ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}
        `);
        const data = yield response.json();
        expect(response.status).to.equal(400);
        expect(data).to.have.property("error");
    }));
});
