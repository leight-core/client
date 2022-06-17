import {IFormContext, IFormErrors, IFormFields} from "@leight-core/api";
import {FormBlockProvider, FormContext, FormUtils} from "@leight-core/client";
import {Form as CoolForm, message} from "antd";
import React, {FC, PropsWithChildren, useState} from "react";
import {useTranslation} from "react-i18next";

export type IFormProviderProps = PropsWithChildren<{
	translation?: string;
}>;

export const FormProvider: FC<IFormProviderProps> = ({translation, ...props}) => {
	const {t} = useTranslation();
	const [errors, setErrors] = useState<IFormErrors>();
	const [form] = CoolForm.useForm();

	const setErrorsInternal: IFormContext["setErrors"] = (errors: IFormErrors) => {
		setErrors(errors);
		errors.message && message.error(t("error." + errors.message));
		form.setFields(((errors || {}).errors || []).map(item => ({
			name: item.id,
			errors: [t("error." + item.error)],
		})));
	};

	const resetErrors: IFormContext["resetErrors"] = () => FormUtils.fields(form).then((fields: IFormFields[]) => fields.map(([field]) => form.setFields([{errors: [], name: field}])));
	return <FormBlockProvider>
		<FormContext.Provider
			value={{
				translation,
				form,
				errors: errors as IFormErrors,
				setErrors: setErrorsInternal,
				setValues: values => form.setFieldsValue(values),
				setValue: values => form.setFields(values.map(value => ({name: value.name, value: value.value}))),
				reset: () => form.resetFields(),
				values: form.getFieldsValue,
				resetErrors,
			}}
			{...props}
		/>
	</FormBlockProvider>;
};
