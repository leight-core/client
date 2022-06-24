import {IUserRequest} from "@leight-core/api";
import {LoaderIcon, Template, User, UserContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";

export type IUserProviderProps = PropsWithChildren<{
	user: IUserRequest;
	isReady: boolean;
	block?: boolean;
}>

export const UserProvider: FC<IUserProviderProps> = ({user, isReady, block = true, children, ...props}) => {
	children = isReady || !block ? children : <Template
		extra={<LoaderIcon/>}
	/>;
	return <UserContext.Provider
		value={{
			user: User(user),
			isReady
		}}
		{...props}
	>
		{children}
	</UserContext.Provider>;
};
