// src/components/HourlyForecast.jsx

import { useState, useMemo, useRef, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { getWeatherIcon } from "../utils/weatherIcons";

function HourlyForecast({ hourlyData, units }) {
	const scrollContainerRef = useRef(null);
	const nowCardRef = useRef(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeftStart = useRef(0);

	const formattedData = useMemo(() => {
		return hourlyData.time
			.map((time, index) => ({
				time: new Date(time).getHours(),
				temp: hourlyData.temperature_2m[index],
				weatherCode: hourlyData.weather_code[index],
			}))
			.slice(0, 24);
	}, [hourlyData]);

	const currentHourIndex = formattedData.findIndex(
		(d) => d.time === new Date().getHours()
	);

	useEffect(() => {
		if (scrollContainerRef.current && nowCardRef.current) {
			const container = scrollContainerRef.current;
			const nowCard = nowCardRef.current;
			const scrollLeft =
				nowCard.offsetLeft -
				container.offsetWidth / 2 +
				nowCard.offsetWidth / 2;
			container.scrollTo({
				left: scrollLeft,
				behavior: "smooth",
			});
		}
	}, [currentHourIndex, formattedData]);

	const handleMouseDown = (e) => {
		if (!scrollContainerRef.current) return;
		isDragging.current = true;
		const container = scrollContainerRef.current;
		startX.current = e.pageX - container.offsetLeft;
		scrollLeftStart.current = container.scrollLeft;
	};

	const handleMouseLeaveOrUp = () => {
		isDragging.current = false;
	};

	const handleMouseMove = (e) => {
		if (!isDragging.current || !scrollContainerRef.current) return;
		e.preventDefault();
		const container = scrollContainerRef.current;
		const x = e.pageX - container.offsetLeft;
		const walk = x - startX.current;
		container.scrollLeft = scrollLeftStart.current - walk;
	};

	const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      return (
        <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/30 shadow-lg">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold text-slate-300">{`${dataPoint.time}:00`}</p>

            <div>
              {getWeatherIcon(dataPoint.weatherCode)}
            </div>

            <p className="text-lg font-bold text-white">
              {`${dataPoint.temp}${units.temperature_2m}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

	return (
		<div className="hourly-forecast mt-10">
			<h2 className="text-2xl font-semibold text-white border-b-2 border-cyan-400/30 pb-2 mb-4">
				Hourly Forecast
			</h2>

			<div className="w-full h-32 -ml-4">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={formattedData}
						margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
					>
						<XAxis
							dataKey="time"
							tickFormatter={(hour) => `${hour}:00`}
							tick={{ fill: "#94a3b8" }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							hide={true}
							domain={["dataMin - 2", "dataMax + 2"]}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{
								stroke: "#38bdf8",
								strokeWidth: 1,
								strokeDasharray: "3 3",
							}}
						/>
						<Line
							type="monotone"
							dataKey="temp"
							stroke="#06b6d4"
							strokeWidth={2}
							dot={{ r: 4, fill: "#0e7490" }}
							activeDot={{
								r: 6,
								fill: "#06b6d4",
								stroke: "#fff",
							}}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div
				ref={scrollContainerRef}
				className="flex space-x-4 overflow-x-auto mt-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none scroll-snap-x mandatory"
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeaveOrUp}
				onMouseUp={handleMouseLeaveOrUp}
				onMouseMove={handleMouseMove}
			>
				{formattedData.map((data, index) => (
					<div
						ref={index === currentHourIndex ? nowCardRef : null}
						key={index}
						className={`flex-shrink-0 w-28 text-center p-4 rounded-lg transform transition-all duration-300
                       ${
							index === currentHourIndex
								? "bg-cyan-400/20 border border-cyan-400/50"
								: "bg-slate-800/60"
						}`}
					>
						<p className="font-bold text-lg text-white">
							{index === currentHourIndex
								? "Now"
								: `${data.time}:00`}
						</p>
						<div className="my-2">
							{getWeatherIcon(data.weatherCode)}
						</div>
						<p className="text-xl font-bold text-white">
							{data.temp}
							<span className="text-lg font-light text-cyan-400">
								{units.temperature_2m}
							</span>
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default HourlyForecast;
