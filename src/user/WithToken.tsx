import {Template, useUserContext} from "@leight-core/client";
import {ComponentProps, FC, PropsWithChildren} from "react";

export type IWithTokenProps = PropsWithChildren<{
	tokens?: string[];
	label?: ComponentProps<typeof Template>["label"];
	template?: ComponentProps<typeof Template>;
}>

export const WithToken: FC<IWithTokenProps> = ({tokens, label, template, children}) => {
	const userContext = useUserContext();
	return userContext.user.hasAny(tokens) ? <>{children}</> : <Template
		status={"403"}
		label={label}
		{...template}
	/>;
};
