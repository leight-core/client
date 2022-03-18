import {isString} from "@leight-core/client";
import {Col, Divider, PageHeader as CoolPageHeader, PageHeaderProps as CoolPageHeaderProps, Row, Space} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
	headerPostfix?: ReactNode;
	values?: any;
}

export const PageHeader: FC<IPageHeaderProps> = ({title, icon, headerPostfix, values, ...props}) => {
	const {t} = useTranslation();
	const _title = isString(title) ? <span>{t(title + ".title", {data: values})}</span> : title;
	return <CoolPageHeader
		title={<Row align={'middle'} style={{width: '60vw', height: '45px'}}>
			<Col>
				<Space>{icon}{_title}</Space>
			</Col>
			{headerPostfix && <Col span={1}>
				<Divider type={'vertical'}/>
			</Col>}
			{headerPostfix && <Col flex={'auto'}>
				{headerPostfix}
			</Col>}
		</Row>}
		{...props}
	/>;
};
