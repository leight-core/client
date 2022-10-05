import {
	Translate,
	useMobileFormContext
}                       from "@leight-core/client";
import {Space}          from "antd";
import {
	Button,
	Form
}                       from "antd-mobile";
import React, {
	ComponentProps,
	FC,
	ReactNode
}                       from "react";
import {useTranslation} from "react-i18next";

export interface IMobileSubmitProps extends Partial<ComponentProps<typeof Button>> {
	/**
	 * Title on the button; goes through react-i18next.
	 */
	label: ReactNode;
	icon?: ReactNode;
}

export const MobileSubmit: FC<IMobileSubmitProps> = ({label, icon, ...props}) => {
	const {t}         = useTranslation();
	const formContext = useMobileFormContext();
	return <Form.Item>
		<Button
			type={"submit"}
			size={"large"}
			color={"primary"}
			block
			{...props}
		>
			<Space>
				{icon}
				<Translate namespace={formContext.translation} text={label}/>
			</Space>
		</Button>
	</Form.Item>;
};
