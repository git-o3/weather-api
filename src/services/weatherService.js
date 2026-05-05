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
    const fullData = response.data;
    
    const prunedData = {
        location: fullData.resolvedAddress,
        timezone: fullData.timezone,
        description: fullData.description,
        current: {
            temp: fullData?.currentConditions?.temp ?? "N/A",   // to prevent app from crashin when api structure change
            conditions: fullData?.currentConditions?.conditions ?? "Unknown", 
            humidity: fullData.currentConditions.humidity,
            windspeed: fullData.currentConditions.windspeed,
            icon: fullData.currentConditions.icon
        },
        forecast: fullData.days.slice(0, 5).map(day => ({
            date: day.datetime,
            tempMax: day.tempmax,
            tempMin: day.tempmin,
            conditions: day.conditions,
            description: day.description,
            icon: day.icon
        }))
    };

    return prunedData
}