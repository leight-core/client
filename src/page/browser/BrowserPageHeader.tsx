import {
	PageHeader as CoolPageHeader,
	PageHeaderProps as CoolPageHeaderProps
}                 from "@ant-design/pro-layout";
import {isString} from "@leight-core/utils";
import {
	Col,
	Row,
	Space
}                 from "antd";
import {
	ComponentProps,
	FC,
	ReactNode
}                 from "react";
import {
	Trans,
	useTranslation
}                 from "react-i18next";

export interface IBrowserPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
	headerPostfix?: ReactNode;
	values?: any;
	components?: ComponentProps<typeof Trans>["components"];
}

export const BrowserPageHeader: FC<IBrowserPageHeaderProps> = ({title, icon, headerPostfix, values, components, ...props}) => {
	const {t}    = useTranslation();
	const $title = isString(title) ? <span>
		<Trans
			t={t}
			i18nKey={title + ".title"}
			components={components}
			values={values}
		/>
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
