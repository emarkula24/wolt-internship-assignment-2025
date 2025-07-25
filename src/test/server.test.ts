import { expect } from "chai"
import exp from "constants"


const base_url = "http://localhost:8000"

const venueSlug = "home-assignment-venue-helsinki"
const cartValue = "1000"
const userLat = 60.17094
const userLon = 24.93087

describe("GET /api/v1/delivery-order-price", () => {
    it ("should return expected response with example parameters", async () => {
        //"expected response" is the one described in the example of the application specifications.
        const response = await fetch(`
                ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lat=${userLat}&user_lon=${userLon}
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

    it("should return error if venue distance is too long", async () => {
        const userLat = 60.22270244680721
        const userLon = 24.860549295080748

        const response = await fetch(`
            ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lat=${userLat}&user_lon=${userLon}
        `);

        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.have.property("message")
        expect(data.message).to.equal("delivery distance is too long")
    })

    it("should return error 400 if user_lon is not present in query parameters", async () => {
        const  response = await fetch(`
            ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lat=${userLat}
        `);
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.have.property("message")
        expect(data.message).to.equal("invalid user_lon")
    })
    it("should return error 400 if user_lat is not present in query parameters", async () => {
            const response = await fetch(`
            ${base_url}/api/v1/delivery-order-price?venue_slug=${venueSlug}&cart_value=${cartValue}&user_lon=${userLon}
        `);
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.have.property("message")
        expect(data.message).to.equal("invalid user_lat")
    })

})