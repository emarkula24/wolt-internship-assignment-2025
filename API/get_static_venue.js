"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getStaticVenue;
const axios_1 = __importDefault(require("axios"));
function getStaticVenue(venue_slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const static_base_url = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venue_slug}/static`;
        try {
            const response = yield axios_1.default.get(static_base_url);
            const data = response.data;
            const coordinates = data.venue_raw.location.coordinates;
            const static_venue_data = {
                coordinates
            };
            return static_venue_data;
        }
        catch (error) {
            console.error("Error fetching static venue data", error);
        }
    });
}
