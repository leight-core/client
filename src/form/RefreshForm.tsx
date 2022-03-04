import {FC, useEffect} from "react";
import {useFormContext} from "@leight-core/client";

export interface IRefreshFormProps {
	children?: never;
}

/**
 * Simple component that forces form refresh (for example when it's built dynamically using Fetches).
 *
 * It's just a shortcut component.
 *
 * Do not use children here!
 */
export const RefreshForm: FC<IRefreshFormProps> = () => {
	const formContext = useFormContext();
	useEffect(() => formContext.refresh());
	return null;
};
