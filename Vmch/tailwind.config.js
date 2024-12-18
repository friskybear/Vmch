const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	daisyui: {
        base:false,
		themes: [
			{
				light: {
					primary: "#08ba9f",
					secondary: "#8ee6d9",
					accent: "#55ecd5",
					neutral: "#1b322e",
					"base-100": "#f2f8f7",
					info: "#0081ff",
					success: "#00c49d",
					warning: "#f5a000",
					error: "#ff8993",
				},
				dark: {
					primary: "#45f7dd",
					secondary: "#197164",
					accent: "#13aa93",
					neutral: "#1b322e",
					"base-100": "#070d0c",
					info: "#0081ff",
					success: "#00c49d",
					warning: "#f5a000",
					error: "#ff8993",
				},
			},
		],
	},
	theme: {
		extend: {
            fontFamily:{
                'fa':['"Baloo Bhaijaan 2"',"sans-serif"],
                'Roboto':["Roboto","sans-serif"]
            },

            animation: {
                marquee: "marquee var(--duration) linear infinite",
                "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
              },
              keyframes: {
                marquee: {
                  from: { transform: "translateX(0)" },
                  to: { transform: "translateX(calc(-100% - var(--gap)))" },
                },
                "marquee-vertical": {
                  from: { transform: "translateY(0)" },
                  to: { transform: "translateY(calc(-100% - var(--gap)))" },
                },
              },
			colors: {
				text: {
					50: "var(--text-50)",
					100: "var(--text-100)",
					200: "var(--text-200)",
					300: "var(--text-300)",
					400: "var(--text-400)",
					500: "var(--text-500)",
					600: "var(--text-600)",
					700: "var(--text-700)",
					800: "var(--text-800)",
					900: "var(--text-900)",
					950: "var(--text-950)",
				},
				background: {
					50: "var(--background-50)",
					100: "var(--background-100)",
					200: "var(--background-200)",
					300: "var(--background-300)",
					400: "var(--background-400)",
					500: "var(--background-500)",
					600: "var(--background-600)",
					700: "var(--background-700)",
					800: "var(--background-800)",
					900: "var(--background-900)",
					950: "var(--background-950)",
				},
				primary: {
					50: "var(--primary-50)",
					100: "var(--primary-100)",
					200: "var(--primary-200)",
					300: "var(--primary-300)",
					400: "var(--primary-400)",
					500: "var(--primary-500)",
					600: "var(--primary-600)",
					700: "var(--primary-700)",
					800: "var(--primary-800)",
					900: "var(--primary-900)",
					950: "var(--primary-950)",
				},
				secondary: {
					50: "var(--secondary-50)",
					100: "var(--secondary-100)",
					200: "var(--secondary-200)",
					300: "var(--secondary-300)",
					400: "var(--secondary-400)",
					500: "var(--secondary-500)",
					600: "var(--secondary-600)",
					700: "var(--secondary-700)",
					800: "var(--secondary-800)",
					900: "var(--secondary-900)",
					950: "var(--secondary-950)",
				},
				accent: {
					50: "var(--accent-50)",
					100: "var(--accent-100)",
					200: "var(--accent-200)",
					300: "var(--accent-300)",
					400: "var(--accent-400)",
					500: "var(--accent-500)",
					600: "var(--accent-600)",
					700: "var(--accent-700)",
					800: "var(--accent-800)",
					900: "var(--accent-900)",
					950: "var(--accent-950)",
				},
			},
		},
	},
	plugins: [
		require("daisyui"),
		require("tailwindcss-animate"),
		require("tailwindcss-motion"),
	],
};