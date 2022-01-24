import {createApiURI} from "app/helpers/global";
import config from "config";

/** Test `createURI` function with current config. */
test("create URI", () => {
	const sep: string = config.BASE_API_URL.endsWith("/") ? "" : "/";
	const BASE_API_URL = `${config.BASE_API_URL}${sep}`;
	expect(createApiURI("test")).toEqual(`${BASE_API_URL}test`);
	expect(createApiURI("/test")).toEqual(`${BASE_API_URL}test`);
	expect(createApiURI("a/b/c")).toEqual(`${BASE_API_URL}a/b/c`);
	expect(createApiURI("/a/b/c")).toEqual(`${BASE_API_URL}a/b/c`);
	expect(createApiURI("/a/b/c/")).toEqual(`${BASE_API_URL}a/b/c/`);
});