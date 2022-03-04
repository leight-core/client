import {createContext} from "react";
import {useContext} from "@leight-core/client";
import {IResponsiveContext} from "@leight-core/api";

export const ResponsiveContext = createContext(null as unknown as IResponsiveContext);

export const useResponsiveContext = () => useContext(ResponsiveContext, "ResponsiveContext");

export const useIsMobile = () => useResponsiveContext().isMobile();
export const useIsBrowser = () => useResponsiveContext().isBrowser();
export const useIsTablet = () => useResponsiveContext().isTablet();
