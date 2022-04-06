import {useFormContext} from "@leight-core/client";
import {Button, ButtonProps, Form} from "antd";
import React, {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export interface ISubmitProps extends Partial<ButtonProps> {
	/**
	 * Disable Form.Item styling.
	 */
	noStyle?: boolean;
	/**
	 * Title on the button; goes through react-i18next.
	 */
	label: string | string[];
}

interface IInternalProps {
	label: string | string[];
}

const Internal: FC<IInternalProps> = ({label, ...props}) => {
	const [canSubmit, setCanSubmit] = useState(false);
	const formContext = useFormContext();

	const {t} = useTranslation();
	useEffect(() => {
		/**
		 * Because we need to ensure all item forms are created, "canSubmit" works asynchronously.
		 */
		const promise = formContext.canSubmit(setCanSubmit);
		return () => promise.cancel();
	});
	return <Button
		htmlType={"submit"}
		type={"primary"}
		disabled={!canSubmit}
		children={t(formContext.translation ? formContext.translation + "." + label : label)}
		{...props}
	/>;
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
export const Submit: FC<ISubmitProps> = ({noStyle, label, ...props}) => {
	return <Form.Item
		shouldUpdate
		noStyle={noStyle}
	>
		{() => <Internal label={label} {...props}/>}
	</Form.Item>;
};
