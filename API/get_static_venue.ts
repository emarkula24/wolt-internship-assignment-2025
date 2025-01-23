import axios from "axios";

export default async function getStaticVenue(venue_slug: string) {

    const static_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/static`;

    try{
        const response = await axios.get(static_base_url);
        const data = response.data;
        const coordinates = data.venue_raw.location.coordinates
        const static_venue_data = {
            coordinates
        }
        return static_venue_data

    } catch(error) {
        console.error("Error fetching static venue data", error)
    }
}