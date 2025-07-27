// src/App.jsx

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { getWeatherData, getCityNameFromCoords } from "./utils/api";
import { weatherDescriptions } from "./utils/constants";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import Loader from "./components/Loader";

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [cityName, setCityName] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const contentRef = useRef(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				fetchAllData(latitude, longitude);
			},
			(err) => {
				setError(`Location Error: ${err.message}`);
				setLoading(false);
			}
		);
	}, []);

	const fetchAllData = async (lat, lon) => {
		try {
			setLoading(true);
			setError(null);
			const [weatherResponse, cityNameResponse] = await Promise.all([
				getWeatherData(lat, lon),
				getCityNameFromCoords(lat, lon),
			]);
			setWeatherData(weatherResponse);
			setCityName(cityNameResponse);
		} catch (err) {
			setError("Failed to fetch location data.");
		} finally {
			setLoading(false);
		}
	};

	useGSAP(
		() => {
			if (!loading && weatherData) {
				gsap.from(contentRef.current, {
					opacity: 0,
					y: 20,
					duration: 0.8,
					ease: "power3.out",
				});
			}
		},
		{ dependencies: [loading, weatherData] }
	);

	const renderContent = () => {
		if (loading) {
			return <Loader />;
		}
		if (error) {
			return (
				<div className="text-xl text-red-400 text-center">{error}</div>
			);
		}
		if (weatherData) {
			const weatherDescription =
				weatherDescriptions[weatherData.current.weather_code];
			const currentTemp = Math.round(weatherData.current.temperature_2m);
			const pageTitle = `${cityName} Weather - ${currentTemp}°C, ${weatherDescription}`;

			return (
				<div ref={contentRef}>
					<title>{pageTitle}</title>
					<header className="text-center">
						<h1 className="text-5xl font-bold text-white">
							{cityName}
						</h1>
						<p className="text-xl font-light text-cyan-300 mt-2">
							{weatherDescription}
						</p>
					</header>
					<main className="mt-8">
						<CurrentWeather
							currentData={weatherData.current}
							units={weatherData.current_units}
						/>
						<HourlyForecast
							hourlyData={weatherData.hourly}
							units={weatherData.hourly_units}
						/>
					</main>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-[#020617] text-slate-200 min-h-screen flex items-center justify-center font-sans">
			<div className="w-full max-w-4xl bg-[#020617] p-4 md:p-10">
				{renderContent()}
			</div>
		</div>
	);
}

export default App;
