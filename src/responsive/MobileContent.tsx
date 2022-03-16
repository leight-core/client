import {FC, ReactNode} from "react";
import {useIsMobile} from "@leight-core/client";

export interface IMobileContentProps {
	fallback?: ReactNode | null;
}

export const MobileContent: FC<IMobileContentProps> = ({children, fallback = null}) => {
	return <>{useIsMobile() ? {children} : fallback}</>;
}
