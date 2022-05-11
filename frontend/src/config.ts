
const ENV = process.env.NODE_ENV.toLowerCase() as "production" | "development" | "test";

const config = {
	acceptedFileExtensionsForVisualization: ".ply, .pcd, .xyz, .xyzrgb",
	acceptedFileExtensionsForConversionOnly: ".ply, .pcd, .xyz, .xyzrgb, .pts",
	BASE_API_URL: {
		development: "http://localhost:3001",
		test: "http://localhost:3001",
		production: "http://167.99.130.178:3001"  // TODO
	}[ENV],
	API_URL: {
		development: "http://localhost:3001/api",
		test: "http://localhost:3001/api",
		production: "http://167.99.130.178:3001/api"  // TODO
	}[ENV]
}

export default config;