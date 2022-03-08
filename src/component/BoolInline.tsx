import {CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone, TwoToneColor} from "@ant-design/icons";
import {Avatar} from "antd";
import {FC} from "react";

export interface IBoolInlineProps {
	bool?: boolean | null;
	trueColor?: TwoToneColor;
	falseColor?: TwoToneColor;
	unknownColor?: TwoToneColor;
}

export const BoolInline: FC<IBoolInlineProps> = ({bool, trueColor = "#71da17", falseColor = "#e26738", unknownColor}) => {
	return <Avatar
		size={"large"}
		style={{backgroundColor: "transparent"}}
		icon={bool !== undefined && bool !== null ?
			(bool ? <CheckCircleTwoTone twoToneColor={trueColor}/> : <CloseCircleTwoTone twoToneColor={falseColor}/>) :
			<MinusCircleTwoTone twoToneColor={unknownColor}/>
		}/>;
};
