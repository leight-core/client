import {useFormContext, UseToken} from "@leight-core/client";
import {Button, Form} from "antd";
import React, {ComponentProps, FC} from "react";
import {useTranslation} from "react-i18next";

export interface ISubmitProps extends Partial<ComponentProps<typeof Button>> {
	/**
	 * Disable Form.Item styling.
	 */
	noStyle?: boolean;
	/**
	 * Title on the button; goes through react-i18next.
	 */
	label: string | string[];
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

interface IInternalProps {
	label: string | string[];
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

const Internal: FC<IInternalProps> = ({label, tokens, ...props}) => {
	const {t} = useTranslation();
	const formContext = useFormContext();
	return <UseToken tokens={tokens}>
		<Button
			htmlType={"submit"}
			type={"primary"}
			children={t(formContext.translation ? formContext.translation + "." + label : label, label)}
			{...props}
		/>
	</UseToken>;
};

/**
 * Button used to submit a form in any way. All fields must be valid to enable this button.
 *
 * Internally:
 *
 * - checks all fields if they're required and filled up
 * - checks for validation errors on fields
 *
 * Some interesting props:
 *
 * - **form** as antd Form instance (usually as Form.useForm())
 * - **title** of the button (goes through translation as is)
 * - other **props** goes to the underlying Antd Button
 *
 * Button props:
 *
 * - **icon** to define Button's icon
 * - **onClick** if you need to somehow handle button by hand
 *
 * Others:
 *
 * - https://ant.design/components/button/
 * - https://ant.design/components/form/#API
 */
export const Submit: FC<ISubmitProps> = ({noStyle, ...props}) => {
	return <Form.Item
		shouldUpdate
		noStyle={noStyle}
	>
		{() => <Internal {...props}/>}
	</Form.Item>;
};
