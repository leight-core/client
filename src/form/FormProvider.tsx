import {FormBlockProvider, FormContext, FormUtils} from "@leight-core/client";
import {Form as CoolForm, message} from "antd";
import React, {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {IFormErrors, IFormFields} from "@leight-core/api";

export interface IFormProviderProps {
	translation?: string;
}

export const FormProvider: FC<IFormProviderProps> = ({translation, ...props}) => {
	const {t} = useTranslation();
	const [errors, setErrors] = useState<IFormErrors>();
	const [form] = CoolForm.useForm();

	const setErrorsInternal = (errors: IFormErrors) => {
		setErrors(errors);
		errors.message && message.error(t("error." + errors.message));
		form.setFields(((errors || {}).errors || []).map(item => ({
			name: item.id,
			errors: [t("error." + item.error)],
		})));
	};

	const resetErrors = () => FormUtils.fields(form).then((fields: IFormFields[]) => fields.map(([field]) => form.setFields([{errors: [], name: field}])));

	return <FormBlockProvider>
		<FormContext.Provider
			value={{
				translation,
				form,
				errors: errors as IFormErrors,
				setErrors: setErrorsInternal,
				setValues: values => form.setFieldsValue(values),
				reset: () => form.resetFields(),
				values: form.getFieldsValue,
				resetErrors,
				refresh: () => form.validateFields().then(resetErrors, resetErrors),
				canSubmit: (then?: (canSubmit: boolean) => void) => {
					const promise = FormUtils.canSubmit(form);
					then && promise.then(then);
					return promise;
				},
			}}
			{...props}
		/>
	</FormBlockProvider>;
};
