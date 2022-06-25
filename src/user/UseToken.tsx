import {useOptionalUserContext} from "@leight-core/client";
import {cloneElement, FC, ReactElement} from "react";

export interface IUseTokenProps {
	tokens?: string[];
	children: ReactElement<{ disabled: boolean }>;
}

export const UseToken: FC<IUseTokenProps> = ({tokens, children}) => {
	const userContext = useOptionalUserContext();
	return !userContext || userContext.user.hasAny(tokens) ? <>{children}</> : cloneElement(children, {disabled: true});
};
