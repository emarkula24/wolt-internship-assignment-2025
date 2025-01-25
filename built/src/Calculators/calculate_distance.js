export default function calculate_distance(user_lat, user_lon, distance_lat, distance_lon) {
    const R = 6371e3;
    const toRadians = (deg) => deg * Math.PI / 180;
    const phi1 = toRadians(user_lat);
    const phi2 = toRadians(distance_lat);
    const deltaPhi = toRadians(distance_lat - user_lat);
    const deltaLambda = toRadians(distance_lon - user_lon);
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}
