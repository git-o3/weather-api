import { asyncHandler } from "../middleware/asyncHandler.js";
import * as weatherService from "../services/weatherService.js";
import * as redisService from "../services/redisService.js";
import logger from "../utils/logger.js";


export const getWeather = asyncHandler(async (req, res) => {
    const  city  = req.params.city.toLowerCase();
    const cachekey = `weather:${city}`;
    //logic flow here;
    // try get data from Redis
    const cachedData = await redisService.getCache(cachekey)

    if (cachedData) {
        logger.info(`Cache Hit for city: ${city}`)
        return res.status(200).json({
            success: true,
            source: "cache",
            data: JSON.parse(cachedData)
        });
    }
    
    logger.info(`Cache Miss for city: ${city}. Fetching from API...`);
    // cache miss; fetch from Visual Crossing
    const freshData = await weatherService.fetchWeatherData(city)

    // store in Redis for future request (12h expiry)
    await redisService.setCache(cachekey, freshData)


    res.status(200).json({ 
        success: true,
        source: "api",
        data: freshData
    });
})