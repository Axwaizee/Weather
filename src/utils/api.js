// src/utils/api.js

export async function getWeatherData(latitude, longitude) {
	const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto`;
	const response = await fetch(apiUrl);
	if (!response.ok) throw new Error("Weather data not available.");
	return response.json();
}

export async function getCityNameFromCoords(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid or NaN coordinates provided:", { latitude, longitude });
    return "Invalid Location";
  }

  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Nominatim API responded with status: ${response.status}`);
      throw new Error("City name not available from Nominatim.");
    }

    const data = await response.json();
    
    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.state;
      return city || "Unknown Location";
    }
    
    throw new Error("Invalid response format from Nominatim.");

  } catch (error) {
    console.error("Error fetching city name from Nominatim:", error);
    return "Current Location";
  }
}