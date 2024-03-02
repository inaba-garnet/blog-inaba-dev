/** @type {import('tailwindcss').Config} */
const {
	iconsPlugin,
	getIconCollections,
} = require("@egoist/tailwindcss-icons");

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"./node_modules/preline/preline.js",
	],
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",
				primary: "#86B6F6",
				secondary: "#B4D4FF",
				bg: "#EEF5FF",
				accent: "#176B87",
			},
			fontFamily: {
				ja: [
					'ヒラギノ角ゴシック',
					'"Noto Sans JP"',
					'Meiryo',
					'YuGothic',
					'Yu Gothic',
					'ＭＳ Ｐゴシック',
					'MS PGothic',
					'sans-serif'
				]
			},
			aspectRatio: {
				'21/9': '21 / 9',
			},
			typography: {
				DEFAULT: {
					css: {
						ul: {
							'padding-left': '1em',
						},
						
					},

				},
				lg: {
					css: {
						ul: {
							'padding-left': '1.25em',
						},
					}
				}

			}
		}
	},
	plugins: [
		require("preline/plugin"),
		require('@tailwindcss/typography'),
		iconsPlugin({
			collections: getIconCollections(["ri","mingcute"]),
		}),],
};
