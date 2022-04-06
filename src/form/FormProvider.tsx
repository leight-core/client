import {IFormContext, IFormErrors, IFormFields} from "@leight-core/api";
import {FormBlockProvider, FormContext, FormUtils} from "@leight-core/client";
import {Form as CoolForm, message} from "antd";
import React, {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export interface IFormProviderProps {
	translation?: string;
}

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

	const canSubmit: IFormContext["canSubmit"] = (then = () => undefined) => {
		const promise = FormUtils.canSubmit(form);
		promise.then(then);
		return promise;
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
				reset: () => form.resetFields(),
				values: form.getFieldsValue,
				resetErrors,
				refresh: () => form.validateFields().then(resetErrors, resetErrors),
				canSubmit,
				useCanSubmit: (then = () => undefined, deps = []) => {
					useEffect(() => {
						form.validateFields().then(() => then?.(true)).catch(() => then?.(false));
						resetErrors();
					}, deps);
				}
			}}
			{...props}
		/>
	</FormBlockProvider>;
};
