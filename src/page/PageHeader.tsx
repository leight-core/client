import {isString} from "@leight-core/client";
import {Col, PageHeader as CoolPageHeader, PageHeaderProps as CoolPageHeaderProps, Row, Space} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
	headerPostfix?: ReactNode;
	values?: any;
}

export const PageHeader: FC<IPageHeaderProps> = ({title, icon, headerPostfix, values, ...props}) => {
	const {t} = useTranslation();
	const $title = isString(title) ? <span>{t(title + ".title", {data: values})}</span> : title;
	return <CoolPageHeader
		title={<Row align={"middle"} style={{width: "60vw", height: "45px"}}>
			<Col>
				<Space>
					{icon}
					{$title}
				</Space>
			</Col>
			{headerPostfix && <Col flex={"auto"}>
				{headerPostfix}
			</Col>}
		</Row>}
		{...props}
	/>;
};
