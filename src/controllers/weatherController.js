import { asyncHandler } from "../middleware/asynHandler.js";
import * as weatherService from "../services/weatherService.js";
import * as redisService from "../services/redisService.js";


export const getWeather = asyncHandler(async (req, res) => {
    const { city } = req.params.city.toLowerCase();
    const cachekey = `weather:${city}`
    //logic flow here;
    // try get data from Redis
    const cachedData = await redisService.getCache(cachekey)

    if (cachedData) {
        return res.status(200).json({
            success: true,
            source: "cache",
            data: cachedData
        });
    }
    
    // cache miss; fetch from Visual Crossing
    const data = await weatherService.fetchWeatherData(city)

    // store in Redis for future request (12h expiry)
    await redisService.setCache(cachekey, freshData)


    res.status(200).json({ 
        success: true,
        source: "api",
        data: freshData
    });
})