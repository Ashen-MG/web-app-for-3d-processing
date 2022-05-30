
const ENV = process.env.NODE_ENV.toLowerCase() as "production" | "development" | "test";

const config = {
	acceptedFileExtensionsForVisualization: ".ply, .pcd, .xyz, .xyzrgb",
	acceptedFileExtensionsForConversionOnly: ".ply, .pcd, .xyz, .xyzrgb, .pts",
	BASE_API_URL: {
		development: "http://localhost:3001",
		test: "http://localhost:3001",
		production: "YOUR_PRODUCT_URL"
	}[ENV],
	API_URL: {
		development: "http://localhost:3001/api",
		test: "http://localhost:3001/api",
		production: "YOUR_PRODUCT_URL"
	}[ENV]
}

export default config;