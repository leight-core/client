import {Form} from "antd";
import {FormListProps} from "antd/lib/form";
import {NamePath} from "rc-field-form/lib/interface";
import React, {FC} from "react";

export type IFormListProps = Partial<FormListProps> & Pick<FormListProps, "children"> & {
	field: NamePath;
};

export const FormList: FC<IFormListProps> = ({field, children, ...props}) => {
	return <Form.List name={field} {...props}>
		{children}
	</Form.List>;
};
