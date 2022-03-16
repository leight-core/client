import {isString} from "@leight-core/client";
import {Col, PageHeader as CoolPageHeader, PageHeaderProps as CoolPageHeaderProps, Row, Space} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
	headerPostfix?: ReactNode;
}

export const PageHeader: FC<IPageHeaderProps> = ({title, icon, headerPostfix, ...props}) => {
	const {t} = useTranslation();
	const _title = isString(title) ? <span>{t(title + ".title")}</span> : title;
	return <CoolPageHeader
		title={<Row align={'middle'} style={{width: '60vw'}}>
			<Col>
				<Space>{icon}{_title}</Space>
			</Col>
			<Col span={1}/>
			{headerPostfix && <Col flex={'auto'}>
				{headerPostfix}
			</Col>}
		</Row>}
		{...props}
	/>;
};
