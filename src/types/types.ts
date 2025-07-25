export interface Ranges {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
}
export interface VenueData {
    orderMinimumNoSurcharge: number;
    basePrice: number;
    distanceRanges: Ranges[];
    coordinates: number[];
}
export interface DopcQueryParams {
    venue_slug: string;
    cart_value: string;
    user_lat: string;
    user_lon: string;
}

export interface ParsedDopcParams {
    venueSlug: string;
    cartValue: number;
    userLat: number;
    userLon: number;
}
