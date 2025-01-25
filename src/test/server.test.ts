import { expect } from "chai"


const base_url = "http://localhost:8000"

describe("GET /api/v1/delivery-order-price", () => {
    it ("should return expected response with correct values", async() => {
        const venue_slug = "home-assignment-venue-helsinki"
        const cart_value = "1000"
        const user_lat = 60.17094
        const user_lon = 24.93087

        const response = await fetch(`
                ${base_url}/api/v1/delivery-order-price?venue_slug=${venue_slug}&cart_value=${cart_value}&user_lat=${user_lat}&user_lon=${user_lon}
            `);
        if (!response.ok) {
            throw new Error()
        }
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("object")
        expect(data).to.have.all.keys("total_price", "small_order_surcharge", "cart_value", "delivery");
        expect(data.delivery).to.have.all.keys("fee", "distance");
        expect(data.total_price).to.equal(1190);
        expect(data.small_order_surcharge).to.equal(0);
        expect(data.cart_value).to.equal(1000);
        expect(data.delivery.fee).to.equal(190);
        expect(data.delivery.distance).to.equal(177);
    })
})