import {useIsBrowser} from "@leight-core/client";
import {FC, PropsWithChildren, ReactNode} from "react";

export type IBrowserContentProps = PropsWithChildren<{
	fallback?: ReactNode | null;
}>;

export const BrowserContent: FC<IBrowserContentProps> = ({children, fallback = null}) => {
	return <>{useIsBrowser() ? children : fallback}</>;
};
