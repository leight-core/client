import {Card as CoolCard, CardProps as CoolCardProps} from "antd";
import {FC} from "react";
import {useTranslation} from "react-i18next";
import {isString, useIsMobile} from "@leight-core/client";

export interface ICardProps extends Partial<CoolCardProps> {
}

export const Card: FC<ICardProps> = ({title, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	return <CoolCard
		bodyStyle={isMobile ? {padding: "8px"} : undefined}
		headStyle={isMobile ? {minHeight: "32px"} : undefined}
		title={isString(title) ? t(title as string) : title}
		bordered={false}
		{...props}
	/>;
};
