import {CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone} from "@ant-design/icons";
import {Avatar} from "antd";
import {FC} from "react";

export interface IBoolInlineProps {
	bool?: boolean | null;
}

export const BoolInline: FC<IBoolInlineProps> = ({bool}) => {
	return <Avatar
		size={"large"}
		style={{backgroundColor: "transparent"}}
		icon={bool !== undefined && bool !== null ?
			(bool ? <CheckCircleTwoTone/> : <CloseCircleTwoTone/>) :
			<MinusCircleTwoTone/>
		}/>;
};
