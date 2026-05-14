import type { NextApiRequest, NextApiResponse } from "next";

type ExternalApiResponse = {
  ok: boolean;
  data?: {
    location: {
      name: string;
      latitude: number;
      longitude: number;
      timezone: string;
    };
    current: {
      time: string;
      temperature2m: number;
      apparentTemperature: number;
      relativeHumidity2m: number;
      precipitation: number;
      weatherCode: number;
      windSpeed10m: number;
    };
    summary: string;
    source: string;
  };
  error?: string;
};

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
};

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExternalApiResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const latitude = Number(process.env.WEATHER_LATITUDE || "25.033");
  const longitude = Number(process.env.WEATHER_LONGITUDE || "121.5654");
  const locationName = process.env.WEATHER_LOCATION_NAME || "Taipei";

  const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
  apiUrl.searchParams.set("latitude", latitude.toString());
  apiUrl.searchParams.set("longitude", longitude.toString());
  apiUrl.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(",")
  );
  apiUrl.searchParams.set("timezone", "auto");

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: "Weather API request failed",
      });
    }

    const data = (await response.json()) as OpenMeteoResponse;

    return res.status(200).json({
      ok: true,
      data: {
        location: {
          name: locationName,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
        },
        current: {
          time: data.current.time,
          temperature2m: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          relativeHumidity2m: data.current.relative_humidity_2m,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed10m: data.current.wind_speed_10m,
        },
        summary: WEATHER_CODES[data.current.weather_code] || "Unknown weather",
        source: "Open-Meteo",
      },
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Weather API unavailable" });
  }
}
