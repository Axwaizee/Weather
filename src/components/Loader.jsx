// src/components/Loader.jsx

import React, { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const loadingTexts = [
	"Consulting the clouds...",
	"Calibrating the sun...",
	"Negotiating with the wind...",
	"Herding weather balloons...",
	"Reticulating splines...",
	"Gauging atmospheric pressure...",
	"Tip: Drag the hourly forecast to see later times.",
	"Did you know: You can add this app to your home screen!",
	"Fun fact: A bolt of lightning is 5 times hotter than the sun's surface.",
	"Did you know: The smell of rain is called 'petrichor'.",
	"Fun fact: A hurricane can release the energy of 10,000 atomic bombs.",
	"Did you know: The coldest temperature recorded was -89.2°C in Antarctica.",
	"Fun fact: A typical cloud can weigh more than a million pounds.",
	"Did you know: Fog is simply a cloud that has formed at ground level.",
	"Fun fact: 'Thundersnow' is a rare thunderstorm where snow falls instead of rain.",
	"Did you know: Some tornadoes can have wind speeds over 300 mph (480 km/h).",
	"Fun fact: It can sometimes rain fish or frogs during strong storms.",
	"Did you know: No two snowflakes are exactly alike.",
	"Fun fact: Saharan dust often travels across the Atlantic to fertilize the Amazon.",
	"Almost there...",
];

function Loader() {
	const textRef = useRef(null);
	const shuffledTexts = useMemo(() => {
		const array = [...loadingTexts];
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}, []);

	useGSAP(
		() => {
			textRef.current.textContent = shuffledTexts[0];

			const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

			tl.to(textRef.current, { duration: 4 });
            
			for (let i = 1; i < shuffledTexts.length; i++) {
				tl.to(textRef.current, {
					opacity: 0,
					y: -10,
					duration: 0.4,
					ease: "power2.in",
				});

				tl.call(() => {
					textRef.current.textContent = shuffledTexts[i];
					gsap.set(textRef.current, { y: 10, opacity: 0 });
				});

				tl.to(textRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.4,
					ease: "power2.out",
				});

				tl.to(textRef.current, { duration: 4 });
			}
		},
		{ scope: textRef }
	);

	return (
		<div className="flex flex-col justify-center items-center h-full gap-4">
			<div className="relative flex flex-col items-center justify-between h-24">
				<div
					className="relative top-0 w-12 h-12 rounded-full animate-spin
border-4 border-solid border-cyan-400 border-t-transparent"
				></div>
				<span
					ref={textRef}
					className="relative top-5 text-slate-300 font-light text-center px-4"
				></span>
			</div>
		</div>
	);
}

export default Loader;
