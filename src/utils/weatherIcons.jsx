// src/utils/weatherIcons.jsx

import {
	WiDaySunny,
	WiNightClear,
	WiDayCloudy,
	WiNightAltCloudy,
	WiCloud,
	WiFog,
	WiDayShowers,
	WiNightAltShowers,
	WiDayRain,
	WiNightAltRain,
	WiDaySleet,
	WiNightAltSleet,
	WiDaySnow,
	WiNightAltSnow,
	WiSnow,
	WiDayThunderstorm,
	WiNightAltThunderstorm,
	WiRainMix,
} from "react-icons/wi";

export const getWeatherIcon = (weatherCode, isDay = 1) => {
	const iconProps = { size: 48, className: "text-cyan-300" };

	switch (weatherCode) {
		case 0:
			return isDay ? (
				<WiDaySunny {...iconProps} />
			) : (
				<WiNightClear {...iconProps} />
			);
		case 1:
		case 2:
			return isDay ? (
				<WiDayCloudy {...iconProps} />
			) : (
				<WiNightAltCloudy {...iconProps} />
			);
		case 3:
			return <WiCloud {...iconProps} />;
		case 45:
		case 48:
			return <WiFog {...iconProps} />;
		case 51:
		case 53:
		case 55:
		case 56:
		case 57:
			return isDay ? (
				<WiDayShowers {...iconProps} />
			) : (
				<WiNightAltShowers {...iconProps} />
			);
		case 61:
		case 63:
		case 65:
			return isDay ? (
				<WiDayRain {...iconProps} />
			) : (
				<WiNightAltRain {...iconProps} />
			);
		case 66:
		case 67:
			return <WiRainMix {...iconProps} />;
		case 71:
		case 73:
		case 75:
			return isDay ? (
				<WiDaySnow {...iconProps} />
			) : (
				<WiNightAltSnow {...iconProps} />
			);
		case 77:
			return <WiSnow {...iconProps} />;
		case 80:
		case 81:
		case 82:
			return isDay ? (
				<WiDayRain {...iconProps} />
			) : (
				<WiNightAltRain {...iconProps} />
			);
		case 85:
		case 86:
			return isDay ? (
				<WiDaySleet {...iconProps} />
			) : (
				<WiNightAltSleet {...iconProps} />
			);
		case 95:
		case 96:
		case 99:
			return isDay ? (
				<WiDayThunderstorm {...iconProps} />
			) : (
				<WiNightAltThunderstorm {...iconProps} />
			);
		default:
			return <WiCloud {...iconProps} />;
	}
};
