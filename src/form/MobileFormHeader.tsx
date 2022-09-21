import {ITranslationProps} from "@leight-core/api";
import {Translate} from "@leight-core/client";
import {Form} from "antd-mobile";
import {ComponentProps, FC} from "react";

export interface IMobileFormHeaderProps extends Partial<ComponentProps<typeof Form["Header"]>> {
	translation: ITranslationProps;
}

export const MobileFormHeader: FC<IMobileFormHeaderProps> = ({translation}) => {
	return <Form.Header>
		<Translate {...translation}/>
	</Form.Header>;
};
