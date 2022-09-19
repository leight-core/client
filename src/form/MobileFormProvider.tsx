import {IFormErrors} from "@leight-core/api";
import {FormBlockProvider, MobileFormContext} from "@leight-core/client";
import {message} from "antd";
import {Form} from "antd-mobile";
import {FC, PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

export type IMobileFormProviderProps = PropsWithChildren<{
	translation?: string;
}>;

export const MobileFormProvider: FC<IMobileFormProviderProps> = ({translation, ...props}) => {
	const {t} = useTranslation();
	const [form] = Form.useForm();
	return <FormBlockProvider>
		<MobileFormContext.Provider
			value={{
				translation,
				form,
				setValues: values => form.setFieldsValue(values),
				setValue: values => form.setFields(values.map(value => ({name: value.name, value: value.value}))),
				reset: () => form.resetFields(),
				values: form.getFieldsValue,
				setErrors: (errors: IFormErrors) => {
					errors.message && message.error(t("error." + errors.message));
					form.setFields(((errors || {}).errors || []).map(item => ({
						name: item.id,
						errors: [t("error." + item.error)],
					})));
				},
			}}
			{...props}
		/>
	</FormBlockProvider>;
};
