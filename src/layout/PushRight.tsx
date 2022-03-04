import {Col, Row} from "antd";
import React, {FC} from "react";

export interface IPushRightProps {
	span?: number;
}

export const PushRight: FC<IPushRightProps> = (
	{
		children,
		span
	}) => {
	return (
		<Row align={"middle"} justify={"end"}>
			<Col span={span}>
				{children}
			</Col>
		</Row>
	);
};
