import {useIsTablet} from "@leight-core/client";
import {FC, ReactNode} from "react";

export interface ITabletContentProps {
	fallback?: ReactNode | null;
}

export const TabletContent: FC<ITabletContentProps> = ({children, fallback = null}) => {
	return <>{useIsTablet() ? {children} : fallback}</>;
};
