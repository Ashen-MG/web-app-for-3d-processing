
const ENV = process.env.NODE_ENV.toLowerCase() as "production" | "development";

const config = {
	supportedFileTypesForVisualization: ["ply", "pcd", "xyz", "xyzrgb"],
	acceptedFileTypes: ".ply, .pcd, .xyz, .xyzrgb, .pts",
	API_URL: {
		development: "http://localhost:3001/api",
		production: "PRODUCTION_API_URL"  // TODO
	}[ENV]
}

export default config;