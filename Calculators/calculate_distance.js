"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = calculate_distance;
function calculate_distance(user_lat, user_lon, distance_lat, distance_lon) {
    const r = 6371;
    const p = Math.PI / 180;
    const a = 0.5 - Math.cos((distance_lat - user_lat) * p) / 2
        + Math.cos(user_lat * p) * Math.cos(distance_lat * p) *
            (1 - Math.cos((distance_lon - user_lon) * p)) / 2;
    return 2 * r * Math.asin(Math.sqrt(a));
}
