import {useUserContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";

export type IShowTokenProps = PropsWithChildren<{
	tokens?: string[];
}>

export const ShowToken: FC<IShowTokenProps> = ({tokens, children}) => {
	const userContext = useUserContext();
	return userContext.user.hasAny(tokens) ? <>{children}</> : null;
};
