import {AntDesignOutlined} from "@ant-design/icons";
import {Centered, LoaderIcon} from "@leight-core/client";
import {Card, Col, Divider, Layout, LayoutProps, Result, Row, Typography} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {UseQueryResult} from "react-query";

export interface ILoaderLayoutProps extends Partial<LayoutProps> {
	logo?: ReactNode;
	icon: ReactNode;
	queryResult?: UseQueryResult;
	loading?: boolean;
	errorText?: string;
}

export const LoaderLayout: FC<ILoaderLayoutProps> = ({logo, icon, queryResult = {isError: false, isSuccess: true, isLoading: true}, errorText, loading, children, ...props}) => {
	const {t} = useTranslation();
	const isLoading = loading !== undefined ? loading : queryResult && queryResult.isLoading;
	return <>
		{(isLoading || queryResult.isError) && <Layout style={{height: "100vh"}} {...props}>
			<Row justify={"center"} align={"middle"}>
				<Col span={24}>
					<Card
						title={logo || <AntDesignOutlined/>}
						headStyle={{textAlign: "center", padding: "2em 0"}}
					>
						<Centered>
							{isLoading && !queryResult.isError && <Result
								icon={<LoaderIcon/>}
							/>}
							{queryResult.isError && <Result
								icon={icon}
								status={"error"}
								title={errorText ? t(errorText) : null}
							/>}
						</Centered>
						<Divider/>
						<Centered>
							<Typography.Text type={"secondary"}>v[{process.env.NEXT_PUBLIC_VERSION}]</Typography.Text>
						</Centered>
					</Card>
				</Col>
			</Row>
		</Layout>}
		{!isLoading && queryResult.isSuccess && children}
	</>;
};
