import config from "config";

export const createApiURI = (path: string): string => {
	return new URL(path, config.BASE_API_URL).href;
}

export const getFileExtension = (filename: string): string => {
	if (!filename.includes('.'))
		return "";
	return filename.split('.').pop()!;
}

export const getRandomString = (length: number) => {
	let result = "";
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++ )
		result += characters[Math.floor(Math.random() * characters.length)];
	return result;
}
