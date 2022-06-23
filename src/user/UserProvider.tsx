import {IUserRequest} from "@leight-core/api";
import {User, UserContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";

export type IUserProviderProps = PropsWithChildren<{
	user: IUserRequest;
	isReady: boolean;
}>

export const UserProvider: FC<IUserProviderProps> = ({user, isReady, ...props}) => {
	return <UserContext.Provider
		value={{
			user: User(user),
			isReady
		}}
		{...props}
	/>;
};
