import {IQueryParams} from "@leight-core/api";
import {compile} from "path-to-regexp";

const generator = (path: string): (query: any) => string => compile(path.replace(/\[(.*?)\]/g, ":$1").replace(/{(.*?)}/g, ":$1"));

export const toLink = <TQuery extends IQueryParams | void = void>(href: string, query?: TQuery): string => {
	return href === "/" ? href : generator(href)(query);
};
