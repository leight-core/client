import {useEffect} from "react";
import {QueryClient, useMutation, useQuery} from "react-query";
import {broadcastQueryClient} from "react-query/broadcastQueryClient-experimental";
import {createWebStoragePersistor} from "react-query/createWebStoragePersistor-experimental";
import {persistQueryClient} from "react-query/persistQueryClient-experimental";
import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";
import {IHookCallback, IMutationHook, IQueryHook, IQueryParams} from "@leight-core/api";
import {useLinkContext} from "../link";

/**
 * @param cacheTime cache time in hours
 */
export function createQueryClient(cacheTime = 24): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				cacheTime: 1000 * 60 * 60 * cacheTime,
			}
		}
	});
}

export function useQueryPersistence(queryClient: QueryClient, name: string, buster?: string, enable: boolean = process.env.NEXT_PUBLIC_CACHE === "true"): boolean {
	if (!enable) {
		return enable;
	}
	useEffect(() => {
		persistQueryClient({
			queryClient,
			persistor: createWebStoragePersistor({storage: window.sessionStorage}),
			buster: buster || process.env.BUILD_ID,
		}).then(() => broadcastQueryClient({
			queryClient,
			broadcastChannel: name,
		}));
	}, []);
	return enable;
}

export const toPromise = <TRequest, TResponse>(method: Method, url: string, request?: TRequest, config?: AxiosRequestConfig<TRequest>) => new Promise<TResponse>((resolve, reject) => {
	axios.request<TResponse, AxiosResponse<TResponse>, TRequest>({
		method,
		url,
		data: request,
		...config,
	})
		.then(result => resolve(result.data))
		.catch(reject);
});

/**
 * Create react-query hook (~ needs to be used as a hook).
 */
export function createQueryHook<TRequest, TResponse, TQueryParams extends IQueryParams | void = void>(link: string, method: Method): IQueryHook<TRequest, TResponse, TQueryParams> {
	return (request?, query?, options?, config?) => {
		const linkContext = useLinkContext();
		return useQuery([link, {query, request}], () => toPromise<TRequest, TResponse>(method, linkContext.link(link, query), request, config), options)
	};
}

export function createMutationHook<TRequest, TResponse, TQueryParams extends IQueryParams | void = void>(link: string, method: Method): IMutationHook<TRequest, TResponse, TQueryParams> {
	return (query?, options?, config?) => {
		const linkContext = useLinkContext();
		return useMutation<TResponse, any, TRequest>(["mutation", link, {query}], request => toPromise<TRequest, TResponse>(method, linkContext.link(link, query), request, config), options)
	};
}

/**
 * Returned method must be used as a hook, but later on requests can be made arbitrary.
 */
export function createPromiseHook<TRequest, TResponse, TQueryParams extends IQueryParams | void = void>(link: string, method: Method): IHookCallback<TRequest, TResponse, TQueryParams> {
	/**
	 * Factory context, nothing interesting here.
	 */
	return () => {
		/**
		 * Hook context, must be called as proper hook.
		 */
		const linkContext = useLinkContext();
		/**
		 * Hook-free context, can be called anywhere.
		 */
		return (request?, query?, config?) => toPromise<TRequest, TResponse>(method, linkContext.link(link, query), request, config)
	};
}
