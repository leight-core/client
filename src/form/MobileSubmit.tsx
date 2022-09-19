import {useMobileFormContext, UseToken} from "@leight-core/client";
import {Button, Form} from "antd-mobile";
import React, {ComponentProps, FC} from "react";
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
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

interface IInternalProps {
	label: string | string[];
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

const Internal: FC<IInternalProps> = ({label, tokens, ...props}) => {
	const {t} = useTranslation();
	const formContext = useMobileFormContext();
	return <UseToken tokens={tokens}>
		<Button
			type={"submit"}
			block
			{...props}
		>
			{t(formContext.translation ? formContext.translation + "." + label : label)}
		</Button>
	</UseToken>;
};

export const MobileSubmit: FC<IMobileSubmitProps> = ({noStyle, ...props}) => {
	return <Form.Item
		shouldUpdate
		noStyle={noStyle}
	>
		{() => <Internal {...props}/>}
	</Form.Item>;
};
