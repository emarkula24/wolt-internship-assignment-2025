"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = calculate_small_order_surcharge;
function calculate_small_order_surcharge(order_minimum_no_surcharge, cart_value) {
    let small_order_surcharge = order_minimum_no_surcharge - cart_value;
    if (small_order_surcharge < 0) {
        small_order_surcharge = 0;
    }
    return small_order_surcharge;
}
