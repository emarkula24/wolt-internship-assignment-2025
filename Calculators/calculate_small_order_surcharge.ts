export default function calculate_small_order_surcharge(order_minimum_no_surcharge: number, cart_value: number) {
    let small_order_surcharge = order_minimum_no_surcharge - cart_value;
    if(small_order_surcharge < 0) {
        small_order_surcharge = 0;
    }
    return small_order_surcharge;
}