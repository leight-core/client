import {Tag, TagProps} from "antd";
import {FC} from "react";
import {useTranslation} from "react-i18next";

export interface ITag {
	id: string;
	code: string;
	label?: string;
}

export interface ITagsProps extends Omit<Partial<TagProps>, "onClick"> {
	translation?: string;
	tags?: ITag[];
	onClick?: (tag: ITag) => void;
}

export const Tags: FC<ITagsProps> = ({translation = "tag", onClick, tags = [], ...props}) => {
	const {t} = useTranslation();
	return <>
		{tags.map(tag => <Tag
			style={{padding: "2px 6px", margin: "2px"}}
			key={tag.id}
			color={"blue"}
			onClick={() => {
				onClick?.(tag);
			}}
			{...props}
		>
			{t(translation + "." + tag.code, tag.label)}
		</Tag>)}
	</>;
};
