
const ENV = process.env.NODE_ENV.toLowerCase() as "production" | "development" | "test";

const config = {
	supportedFileTypesForVisualization: ["ply", "pcd", "xyz", "xyzrgb"],
	acceptedFileTypes: ".ply, .pcd, .xyz, .xyzrgb, .pts",
	BASE_API_URL: {
		development: "http://localhost:3001",
		test: "http://localhost:3001",
		production: "PRODUCTION_API_URL"  // TODO
	}[ENV],
	API_URL: {
		development: "http://localhost:3001/api",
		test: "http://localhost:3001/api",
		production: "PRODUCTION_API_URL"  // TODO
	}[ENV]
}

export default config;