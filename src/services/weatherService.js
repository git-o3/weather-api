import axios from "axios";

/**
 * fetches weather data from Visual Crossing Api
 * @param {string} city - the name of the city
 * @returns {Promise<Object>} - weather data
 */

export const fetchWeatherData = async (city) => {
    const API_KEY = process.env.WEATHER_API_KEY;
    const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";


    const url = `${BASE_URL}/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;
    
    const response = await axios.get(url);
    
    return response.data;
}