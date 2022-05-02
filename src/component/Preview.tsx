import {List, ListProps} from "antd";
import {FC, PropsWithChildren, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IPreviewProps extends Partial<Omit<ListProps<any>, "children">> {
	translation?: string;
	hideEmpty?: boolean;
	children: { [index in string]: ReactNode };
}

export const Preview: FC<PropsWithChildren<IPreviewProps>> = ({translation, hideEmpty = false, children, ...props}) => {
	const {t} = useTranslation();
	return <List
		itemLayout={"vertical"}
		size={"small"}
		{...props}
	>
		{Object.entries(children).map(([key, item]) => (item || (!item && !hideEmpty)) && <List.Item
			key={key}
		>
			<List.Item.Meta
				title={t(translation ? (translation + "." + key) : key)}
				description={item ? item : "-"}
			/>
		</List.Item>)}
	</List>;
};
