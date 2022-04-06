import {useIsMobile} from "@leight-core/client";
import {FC, ReactNode} from "react";

export interface IMobileContentProps {
	fallback?: ReactNode | null;
}

export const MobileContent: FC<IMobileContentProps> = ({children, fallback = null}) => {
	return <>{useIsMobile() ? {children} : fallback}</>;
};
