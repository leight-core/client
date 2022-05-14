import {isString} from "@leight-core/client";
import {Col, PageHeader as CoolPageHeader, PageHeaderProps as CoolPageHeaderProps, Row, Space} from "antd";
import {FC, ReactNode} from "react";
import {Trans} from "react-i18next";

export interface IPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
	headerPostfix?: ReactNode;
	values?: any;
}

export const PageHeader: FC<IPageHeaderProps> = ({title, icon, headerPostfix, values, ...props}) => {
	const $title = isString(title) ? <span>
		<Trans i18nKey={title + ".title"} values={values}/>
	</span> : title;
	return <CoolPageHeader
		title={<Row align={"middle"} style={{width: "60vw", height: "45px"}}>
			<Col>
				<Space align={"baseline"}>
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
