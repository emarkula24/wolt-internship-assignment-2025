import { expect } from "chai"
import { calculateDeliveryFee, calculateSmallOrderSurcharge } from "../services/venueService.js"
import { Ranges } from "../types/types.js"


describe("TEST calculateSmallOrderSurcharge", () => {
    it("should return smallOrderSurcharge with cartValue lower than orderMinimumNoSurcharge", () => {
        let orderMinimumNoSurcharge = 1000
        let cartValue = 300
        const t = calculateSmallOrderSurcharge(orderMinimumNoSurcharge, cartValue)
        expect(t).to.equal(700)
    })
    it("should return 0 instead of a negative value with cartValue larger than orderMinimumNoSurcharge", () => {
        const orderMinimumNoSurcharge = 1000
        const cartValue = 1100
        const t = calculateSmallOrderSurcharge(orderMinimumNoSurcharge, cartValue)
        expect(t).to.equal(0)
    })
    it("should return error with negative cartValue", () => {
        const orderMinimumNoSurcharge = 100
        const cartValue = -1
        const func = () => calculateSmallOrderSurcharge(orderMinimumNoSurcharge, cartValue)
        expect(func).to.throw(Error)
        expect(func).to.throw("invalid_cart_value")
    })
})

describe("TEST calculateDeliveryFeee", () => {
    const distanceRanges: Ranges[] = [
        {
            min: 0,
            max: 500,
            a: 0,
            b: 0,
            flag: null
        },
        {
            min: 500,
            max: 1000,
            a: 100,
            b: 1,
            flag: null
        },
        {
            min: 1000,
            max: 0,
            a: 0,
            b: 0,
            flag: null
        }
    ]

    it("should return expected value", () => {
        const basePrice = 199
        const distance = 600

        const t = calculateDeliveryFee(distanceRanges, basePrice, distance)
        expect(t).to.equal(359)
    })
    it("should return error when distance is equal to upper bound of distance ranges", () => {
        const basePrice = 199
        const distance = 1000

        const func = () => calculateDeliveryFee(distanceRanges, basePrice, distance)
        expect(func).to.throw(Error)
        expect(func).to.throw("delivery distance is too long")
    })
    it("should return error when distance is higher than upper bound of distance ranges", () => {
        const basePrice = 199
        const distance = 1001

        const func = () => calculateDeliveryFee(distanceRanges, basePrice, distance)
        expect(func).to.throw(Error)
        expect(func).to.throw("delivery distance is too long")     
    })
    it("should return expected delivery fee when distance is lower than upper bound of distance ranges", () =>{
        const basePrice = 200
        const distance = 999

        const t = calculateDeliveryFee(distanceRanges, basePrice, distance)
        expect(t).to.equal(399.9)
    })
})