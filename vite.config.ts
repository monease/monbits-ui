import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "MonbitsUI",
			formats: ["es", "cjs"],
			fileName: (format) => {
				if (format === "es") return "index.js";
				if (format === "cjs") return "index.cjs";
				return `index.${format}.js`;
			},
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react-router-dom",
				"lucide-react",
				"next-themes",
				"react-hook-form",
				"zod",
			],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
		sourcemap: true,
		minify: false,
	},
	plugins: [
		dts({
			include: ["src/**/*"],
			outDir: "dist",
			insertTypesEntry: true,
		}),
	],
});
