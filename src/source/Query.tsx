import {IEntityContext, IQueryHook, IQueryParams} from "@leight-core/api";
import {PropsWithChildren, ReactNode, useEffect} from "react";
import {UseQueryOptions} from "react-query";

export interface IQueryProps<TRequest, TResponse, TQuery extends IQueryParams = IQueryParams> {
	useQuery: IQueryHook<TRequest, TResponse, TQuery>;
	request: TRequest;
	query?: TQuery;
	options?: UseQueryOptions<any, any, TResponse>;
	/**
	 * Actual children rendered when data are available.
	 */
	children?: (data: TResponse) => ReactNode;
	/**
	 * Placeholder rendered when data are not available.
	 */
	placeholder?: () => ReactNode;
	context?: IEntityContext<TResponse> | null;
	onUpdate?: (entity: TResponse) => void;
}

export const Query = <TRequest, TResponse, TQuery extends IQueryParams = IQueryParams>(
	{
		useQuery,
		request,
		query,
		options,
		children = () => null,
		context,
		onUpdate,
		placeholder = () => null,
	}: PropsWithChildren<IQueryProps<TRequest, TResponse, TQuery>>) => {
	const result = useQuery(request, query, options);
	useEffect(() => {
		context && result.data && context.update(result.data);
		result.data && onUpdate?.(result.data);
	}, [result.data]);
	return <>
		{context ?
			(context.entity ? children(context.entity) : placeholder()) :
			(result.isSuccess ? children(result.data) : placeholder())
		}
	</>;
};
