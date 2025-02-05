# Wolt Internship Assignment – API Endpoint for Distance & Pricing Calculations
This repository contains a backend API endpoint developed as part of the Wolt internship assignment. It provides an API endpoint that retrieves data from multiple internal APIs, performs coordinate-based distance calculations, and computes pricing based on predefined factors. The detailed specifications for this endpoint are found [here](https://github.com/emarkula24/backend-internship-2025).

**Note:** The internal APIs provided for this assignment may no longer be functional.
# Requirements
  ```sh
  node.js v18 or later
  ```

# Install & Run
  ```sh
  npm install
  npm run dev
  ```
Example request:
```sh
curl http://localhost:8000/api/v1/delivery-order-price?venue_slug=home-assignment-venue-helsinki&cart_value=1000&user_lat=60.17094&user_lon=24.93087
```
# Run tests
  ```sh
  npm run test
  ```
