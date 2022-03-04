import {Col, Row} from "antd";
import React, {FC} from "react";

export interface ICenteredProps {
	span?: number;
}

export const Centered: FC<ICenteredProps> = (
	{
		children,
		span
	}) => {
	return <Row justify={"center"}>
		<Col span={span}>
			{children}
		</Col>
	</Row>;
};
