# Weather API Service

A production-grade weather forecasting API built with Node.js and Express. Integrates the Visual Crossing Weather API with Redis caching to deliver fast, cost-efficient responses — pruning 500KB+ third-party payloads down to a clean ~2KB response.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-v5-blue) ![Redis](https://img.shields.io/badge/Cache-Redis-red)

## Features

- **Redis Caching** — city responses are cached with a 12-hour TTL, eliminating redundant API calls and reducing latency on repeat requests
- **Optimized Payloads** — raw Visual Crossing responses are mapped down to only the data that matters: current conditions, forecast, and location
- **Rate Limiting** — 100 requests per 15-minute window per client to protect against abuse
- **Structured Logging** — Winston + Morgan for request logging and system monitoring
- **Async Error Handling** — centralized `asyncHandler` wrapper keeps controllers clean and the process crash-free
- **Cache Key Sanitization** — city inputs are normalized to lowercase before use as Redis keys, preventing duplicate or colliding cache entries

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Cache | Redis |
| Logging | Winston + Morgan |
| Weather Data | Visual Crossing Timeline API |

## Project Structure

```
weather-api/
├── src/
│   ├── controllers/       # Request handling and cache logic
│   ├── middleware/        # Rate limiting, error handling, Morgan
│   ├── routes/            # API endpoint definitions
│   ├── services/          # Visual Crossing integration and Redis client
│   ├── utils/             # Winston logger config
│   └── app.js             # Express app setup
│   └── server.js          # Entry point
├── .env                   # Environment variables
└── package.json
```

Project URL: https://roadmap.sh/projects/weather-api-wrapper-service

## Installation

```bash
git clone https://github.com/git-o3/weather-api.git
cd weather-api
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
WEATHER_API_KEY=your_visual_crossing_key
REDIS_URL=redis://localhost:6379
```

Get a free Visual Crossing API key at: https://www.visualcrossing.com/weather-api

## Running the Service

```bash
# Development (with Nodemon)
npm run dev

# Production
npm start
```

```
🌬️ Weather API is running on port 3000 Chief 🫡
```

## API Reference

### Get Weather by City

```
GET /api/v1/weather/:city
```

**Example:**
```bash
curl http://localhost:3000/api/v1/weather/london
```

**Response — Cache Hit:**
```json
{
  "success": true,
  "source": "cache",
  "data": {
    "location": "London, England, United Kingdom",
    "timezone": "Europe/London",
    "description": "Similar temperatures continuing with a chance of rain.",
    "current": {
      "temp": 14.2,
      "conditions": "Partially cloudy",
      "icon": "partly-cloudy-day"
    },
    "forecast": [
      {
        "date": "2026-05-05",
        "tempMax": 16.4,
        "tempMin": 9.1,
        "conditions": "Rain, Partially cloudy"
      }
    ]
  }
}
```

**Response — API Hit:**

Same structure with `"source": "api"` — indicates the data was freshly fetched and has now been written to cache.

### Health Check

```
GET /api/health
```

Returns `200 OK` — use this to verify the service is running.

## How It Works

### Cache Flow

Every request to `/api/v1/weather/:city` follows this path:

```
Incoming Request
      │
      ▼
Normalize city (lowercase + trim)
      │
      ▼
Check Redis for key: weather:{city}
      │
   ┌──┴──┐
  HIT   MISS
   │      │
   │      ▼
   │   Fetch from Visual Crossing API
   │      │
   │      ▼
   │   Map response → lean ~2KB payload
   │      │
   │      ▼
   │   Store in Redis (12h TTL)
   │      │
   └──────┤
          ▼
    Return JSON response
```

### Rate Limiting

Requests to the weather route are capped at **100 per 15-minute window** per IP. Implemented via `express-rate-limit` in `middleware/rateLimiter.js`.

### Error Handling

All controller functions are wrapped in `asyncHandler`, a higher-order function that catches any thrown errors and forwards them to the `globalErrorHandler` middleware — keeping the Node.js process stable even when Visual Crossing is unreachable or a city is invalid.

## Requirements

- Node.js v18+
- Redis running locally or via a cloud provider (e.g. Redis Cloud)

## License

MIT