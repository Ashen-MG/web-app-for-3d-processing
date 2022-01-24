import config from "config";

export const createApiURI = (path: string): string => {
	return new URL(path, config.BASE_API_URL).href;
}