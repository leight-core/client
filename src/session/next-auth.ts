import {useQuery} from "react-query"
import {useRouter} from "next/router"
import {UseQueryOptions} from "react-query/types/react/types";

export async function fetchSession() {
	const res = await fetch("/api/auth/session")
	const session = await res.json()
	if (Object.keys(session).length) {
		return session
	}
	return null
}

export interface IUseSessionRequest {
	required?: boolean;
	redirectTo?: string;
	queryConfig?: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>;
}

export function useSession(
	{
		required,
		redirectTo = "/api/auth/signin?error=SessionExpired",
		queryConfig = {},
	}: IUseSessionRequest = {}) {
	const router = useRouter()
	const query = useQuery(["session"], fetchSession, {
		...queryConfig,
		onSettled(data, error) {
			queryConfig?.onSettled?.(data, error)
			if (!data && required) {
				router.push(redirectTo);
			}
		},
	})
	return [query.data, query.status === "loading"]
}
