import {isString} from "@leight-core/utils";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface ITranslateProps {
	base?: string;
	text: string | ReactNode;
	values?: Record<string, any>;
}

export const Translate: FC<ITranslateProps> = ({base, text, values}) => {
	const {t} = useTranslation();
	return <>{isString(text) ? t(base ? `${base}.${text}` : `${text}`, values) : text}</>;
};
