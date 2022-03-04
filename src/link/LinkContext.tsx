import {createContext} from "react";
import {useContext} from "@leight-core/client";
import {ILinkContext} from "@leight-core/api";

export const LinkContext = createContext<ILinkContext>(null as unknown as ILinkContext);

export const useLinkContext = () => useContext<ILinkContext>(LinkContext, "LinkContext");
