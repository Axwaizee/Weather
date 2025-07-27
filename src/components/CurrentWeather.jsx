// src/components/CurrentWeather.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { current_definition } from "../utils/constants";
import { gsap } from "gsap";

const formatIsDay = (value) => (value === 1 ? "Day" : "Night");

function CurrentWeather({ currentData, units }) {
	const gridRef = useRef(null);

	useGSAP(
		() => {
			gsap.from(".detail-item", {
				opacity: 0,
				y: 30,
				duration: 0.5,
				stagger: 0.1,
				ease: "power3.out",
				delay: 0.5,
			});
		},
		{ scope: gridRef }
	);

	const weatherDetails = Object.entries(currentData).filter(
		([key]) =>
			key !== "time" && key !== "weather_code" && key !== "interval"
	);

	return (
		<div className="current-weather">
			<h2 className="text-2xl font-semibold text-white border-b-2 border-cyan-400/30 pb-2 mb-6">
				Current Weather
			</h2>
			<div
				ref={gridRef}
				className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
			>
				{weatherDetails.map(([key, value]) => (
					<div
						key={key}
						className="detail-item bg-slate-800/60 p-4 rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:bg-slate-700/80 shadow-md"
					>
						<span className="text-sm text-slate-400">
							{current_definition[key] || key}
						</span>
						<span className="text-2xl font-bold text-white mt-1">
							{key === "is_day" ? formatIsDay(value) : value}
							<span className="text-lg font-light text-cyan-400 ml-1">
								{units[key]}
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default CurrentWeather;
