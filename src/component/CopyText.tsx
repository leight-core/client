import {Typography} from "antd";
import {FC} from "react";
import {useTranslation} from "react-i18next";

export interface ICopyTextProps {
	copy: string;
	/**
	 * Translation label for copy tooltips
	 */
	tooltip: string;
}

export const CopyText: FC<ICopyTextProps> = ({children, tooltip, copy}) => {
	const {t} = useTranslation();
	return <Typography.Text
		copyable={{
			text: copy,
			tooltips: [t(tooltip + ".copy"), t(tooltip + ".copied")]
		}}
		children={children}
	/>;
};
