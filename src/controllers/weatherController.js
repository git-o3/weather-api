import { asyncHandler } from "../middleware/asynHandler.js"
import * as weatherService from "../services/weatherService.js"


export const getWeather = asyncHandler(async (req, res) => {
    const { city } = req.params;
    //logic flow here;


    const data = await weatherService.fetchWeatherData(city)


    res.status(200).json({ 
        success: true,
        source: "api",
        data
    });
})