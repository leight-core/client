import {createQueryHook} from "@leight-core/client";
import {ITranslations} from "@leight-core/api";

export const useTranslationQuery = (link: string) => createQueryHook<undefined, ITranslations>(link, "get");
