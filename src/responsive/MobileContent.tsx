import {useIsMobile} from "@leight-core/client";
import {FC, PropsWithChildren, ReactNode} from "react";

export type IMobileContentProps = PropsWithChildren<{
	fallback?: ReactNode | null;
}>;

export const MobileContent: FC<IMobileContentProps> = ({children, fallback = null}) => {
	return <>{useIsMobile() ? {children} : fallback}</>;
};
