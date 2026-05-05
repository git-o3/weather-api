import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
})

client.on("error", (err) => console.error("Redis Client Error", err));

//establish connection 
await client.connect();

/**
 * get data from cache
 * @param {string} key
 */
export const getCache = async (key) => {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
}

/**
 * @param {string} key
 * @param {object} value
 * @param {numeber} ttl - time to live in seconds (deault 12 hours)
 */

export const setCache = async (key, value, ttl = 43200) => {
    await client.set(key, JSON.stringify(value), {
        EX: ttl
    })
};

export default client;