import {INavigate, IQueryParams} from "@leight-core/api";
import {useRouter} from "next/router";

export const useNavigate = <TQuery extends IQueryParams | void = void>(): INavigate<TQuery> => {
	const router = useRouter();
	return (href: string, query?: TQuery) => {
		router
			.push({pathname: href, query: query || undefined})
			.catch(e => console.error(e));
	};
};
