import {ILinkContext} from "@leight-core/api";
import {useContext} from "@leight-core/client";
import {createContext} from "react";

export const LinkContext = createContext<ILinkContext>(null as unknown as ILinkContext);

export const useLinkContext = () => useContext<ILinkContext>(LinkContext, "LinkContext");
