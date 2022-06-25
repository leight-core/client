import {useOptionalUserContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";

export type IShowTokenProps = PropsWithChildren<{
	tokens?: string[];
}>

export const ShowToken: FC<IShowTokenProps> = ({tokens, children}) => {
	const userContext = useOptionalUserContext();
	return !userContext || userContext.user.hasAny(tokens) ? <>{children}</> : null;
};
