import {FC, ReactNode} from "react";
import {useIsBrowser} from "@leight-core/client";

export interface IBrowserContentProps {
	fallback?: ReactNode | null;
}

export const BrowserContent: FC<IBrowserContentProps> = ({children, fallback = null}) => {
	return <>{useIsBrowser() ? {children} : fallback}</>;
}