import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate", // Automatically updates the app when new content is available
			// The manifest contains all the metadata for your PWA
			manifest: {
				name: "Weather", // The full name of your app
				short_name: "Weather", // The name shown on the home screen
				description:
					"A clean, modern weather app with real-time local forecasts.",
				theme_color: "#0f172a", // The browser toolbar color (slate-900)
				background_color: "#020617", // The splash screen color (slate-950)
				display: "standalone",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						// A "maskable" icon ensures your logo looks great on all Android devices
						src: "android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
