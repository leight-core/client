import {IQueryParams} from "@leight-core/api";
import {LinkContext} from "@leight-core/client";
import {compile} from "path-to-regexp";
import {FC, useRef} from "react";

export interface ILinkProviderProps {
}

export const LinkProvider: FC<ILinkProviderProps> = props => {
	const cache = useRef<{ [index: string]: any }>({});
	const count = useRef<number>(0);
	const limit = 10000;

	function generator(path: string) {
		path = path.replace(/\[(.*?)\]/g, ":$1").replace(/{(.*?)}/g, ":$1");
		if (cache.current[path]) {
			return cache.current[path];
		}
		const generator = compile(path);
		if (++count.current >= limit) {
			cache.current = {};
		}
		return cache.current[path] = generator;
	}

	return <LinkContext.Provider
		value={{
			link<TQuery extends IQueryParams | void = void>(href: string, query?: TQuery): string {
				return href === "/" ? href : generator(href)(query, {pretty: true});
			}
		}}
		{...props}
	/>;
};
