interface Ranges {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
  }

export default function calculate_fee(distance: number, distance_ranges: Ranges[], base_price: number) {
    let isDeliveryPossible = true
    let total = 0;
    let data = {
        isDeliveryPossible,
        total
    }
    for (const object of distance_ranges) {
        if (distance >= object.min && object.max === 0) {
            isDeliveryPossible = false;
            break;
        }
        else if(distance >= object.min && distance <= object.max) {
            total = base_price + object.a + (object.b * distance / 10);
        }
    }
    return data
}