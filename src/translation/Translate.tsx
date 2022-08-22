import {isString} from "@leight-core/utils";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface ITranslateProps {
	text: string | ReactNode;
}

export const Translate: FC<ITranslateProps> = ({text}) => {
	const {t} = useTranslation();
	return <>{isString(text) ? t(text as string) : text}</>;
};
