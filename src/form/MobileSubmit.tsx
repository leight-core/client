import {useMobileFormContext, UseToken} from "@leight-core/client";
import {Space} from "antd";
import {Button, Form} from "antd-mobile";
import React, {ComponentProps, FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IMobileSubmitProps extends Partial<ComponentProps<typeof Button>> {
	/**
	 * Disable Form.Item styling.
	 */
	noStyle?: boolean;
	/**
	 * Title on the button; goes through react-i18next.
	 */
	label: string | string[];
	icon?: ReactNode;
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

export const MobileSubmit: FC<IMobileSubmitProps> = ({noStyle, label, tokens, icon, ...props}) => {
	const {t} = useTranslation();
	const formContext = useMobileFormContext();
	return <UseToken tokens={tokens}>
		<Form.Item
			shouldUpdate
			noStyle={noStyle}
		>
			<Button
				type={"submit"}
				size={"large"}
				color={"primary"}
				block
				{...props}
			>
				<Space>
					{icon}
					{t(formContext.translation ? formContext.translation + "." + label : label)}
				</Space>
			</Button>
		</Form.Item>
	</UseToken>;
};
