
const ENV = process.env.NODE_ENV.toLowerCase() as "production" | "development" | "test";

const config = {
	acceptedFileExtensionsForVisualization: ".ply, .pcd, .xyz, .xyzrgb",
	acceptedFileExtensionsForConversionOnly: ".ply, .pcd, .xyz, .xyzrgb, .pts",
	BASE_API_URL: {
		development: "http://localhost:3001",
		test: "http://localhost:3001",
		production: "https://web-app-for-3d-processing.martingergel.com/api"
	}[ENV],
	API_URL: {
		development: "http://localhost:3001/api",
		test: "http://localhost:3001/api",
		production: "https://web-app-for-3d-processing.martingergel.com/api"
	}[ENV]
}

export default config;