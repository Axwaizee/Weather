// src/App.jsx

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getWeatherData, getCityNameFromCoords } from "./utils/api";
import { weatherDescriptions } from "./utils/constants";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import { gsap } from "gsap";

function App() {
	const [weatherData, setWeatherData] = useState(null);
	const [cityName, setCityName] = useState("Loading City...");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const container = useRef(null);

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

	useGSAP(
		() => {
			if (!loading && weatherData) {
				gsap.to(container.current, {
					opacity: 1,
					duration: 1,
					ease: "power3.out",
				});
			}
		},
		{ dependencies: [loading, weatherData] }
	);

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

	const renderContent = () => {
		if (loading) {
			return (
				<div className="text-xl font-light">
					Fetching your local forecast...
				</div>
			);
		}
		if (error) {
			return <div className="text-xl text-red-400">{error}</div>;
		}
		if (weatherData) {
			return (
				<>
					<header className="text-center">
						<h1 className="text-5xl font-bold text-white">
							{cityName}
						</h1>
						<p className="text-xl font-light text-cyan-300 mt-2">
							{weatherData.current?.weather_code !== undefined
								? weatherDescriptions[
										weatherData.current.weather_code
								  ]
								: "Weather description unavailable"}
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
				</>
			);
		}
		return null;
	};

	return (
		<div className="bg-slate-800 text-slate-200 min-h-screen flex items-center justify-center p-4 font-sans">
			<div
				ref={container}
				className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-10 opacity-0"
			>
				{renderContent()}
			</div>
		</div>
	);
}

export default App;
