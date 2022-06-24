import {Template, useUserContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";

export type IWithTokenProps = PropsWithChildren<{
	tokens?: string[];
}>

export const WithToken: FC<IWithTokenProps> = ({tokens, children}) => {
	const userContext = useUserContext();
	return userContext.user.hasAny(tokens) ? <>{children}</> : <Template
		status={"403"}
	/>;
};
