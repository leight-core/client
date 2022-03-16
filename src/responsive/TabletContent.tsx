import {FC, ReactNode} from "react";
import {useIsTablet} from "@leight-core/client";

export interface ITabletContentProps {
	fallback?: ReactNode | null;
}

export const TabletContent: FC<ITabletContentProps> = ({children, fallback = null}) => {
	return <>{useIsTablet() ? {children} : fallback}</>;
}
