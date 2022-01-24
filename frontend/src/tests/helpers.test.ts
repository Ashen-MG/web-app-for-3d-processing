import {createURI} from "app/helpers/global";
import config from "config";

/** Test `createURI` function with current config. */
test("create URI", () => {
	const sep: string = config.BASE_API_URL.endsWith("/") ? "" : "/";
	const BASE_API_URL = `${config.BASE_API_URL}${sep}`;
	expect(createURI("test")).toEqual(`${BASE_API_URL}test`);
	expect(createURI("/test")).toEqual(`${BASE_API_URL}test`);
	expect(createURI("a/b/c")).toEqual(`${BASE_API_URL}a/b/c`);
	expect(createURI("/a/b/c")).toEqual(`${BASE_API_URL}a/b/c`);
	expect(createURI("/a/b/c/")).toEqual(`${BASE_API_URL}a/b/c/`);
});