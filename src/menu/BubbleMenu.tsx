import {INavigate, Unboxed} from "@leight-core/api";
import {Translate, useNavigate} from "@leight-core/client";
import {ActionSheet, FloatingBubble} from "antd-mobile";
import {AddOutline} from "antd-mobile-icons";
import {ComponentProps, FC, ReactNode, useState} from "react";

export type IActionSheetProps = ComponentProps<typeof ActionSheet>;

export interface IBubbleMenuActionOnClickProps {
	setVisible(visible: boolean): void;

	navigate: INavigate;
}

export type IBubbleMenuAction = Omit<Unboxed<IActionSheetProps["actions"]>, "onClick" | "text"> & {
	text?: ReactNode;
	onClick?(props: IBubbleMenuActionOnClickProps): void;
}

export interface IBubbleMenuProps extends Partial<ComponentProps<typeof FloatingBubble>> {
	translation?: string;
	actions: IBubbleMenuAction[];
	actionSheetProps?: IActionSheetProps;
	initialPosition?: {
		topRight?: number;
		topLeft?: number;
		bottomRight?: number;
		bottomLeft?: number;
	};
}

export const BubbleMenu: FC<IBubbleMenuProps> = ({translation, actionSheetProps, actions, initialPosition: {topRight, topLeft, bottomRight, bottomLeft} = {}, ...props}) => {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();

	const defaultSize = "16px";

	const style = topRight ? {
		"--initial-position-top": `${topRight}px`,
		"--initial-position-right": `${topRight}px`,
		"--edge-distance": `${topRight}px`,
	} : topLeft ? {
		"--initial-position-top": `${topLeft}px`,
		"--initial-position-left": `${topLeft}px`,
		"--edge-distance": `${topLeft}px`,
	} : bottomRight ? {
		"--initial-position-bottom": `${bottomRight}px`,
		"--initial-position-right": `${bottomRight}px`,
		"--edge-distance": `${bottomRight}px`,
	} : bottomLeft ? {
		"--initial-position-bottom": `${bottomLeft}px`,
		"--initial-position-left": `${bottomLeft}px`,
		"--edge-distance": `${bottomLeft}px`,
	} : {
		"--initial-position-top": defaultSize,
		"--initial-position-right": defaultSize,
		"--edge-distance": defaultSize,
	};

	return <>
		<ActionSheet
			visible={visible}
			actions={actions.map(({text, onClick, ...action}) => ({
				...action,
				text: text || <Translate text={translation ? translation + "." + action.key : action.key}/>,
				onClick: onClick ? () => {
					onClick({
						setVisible,
						navigate,
					});
				} : undefined,
			}))}
			onClose={() => setVisible(false)}
			{...actionSheetProps}
		/>
		<FloatingBubble
			axis="y"
			magnetic="x"
			style={style}
			onClick={() => setVisible(true)}
			{...props}
		>
			<AddOutline fontSize={32}/>
		</FloatingBubble>
	</>;
};
