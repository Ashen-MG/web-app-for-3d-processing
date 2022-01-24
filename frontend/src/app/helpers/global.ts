import config from "config";

export const createURI = (path: string): string => {
	return new URL(path, config.BASE_API_URL).href;
}