import {Form as CoolForm, FormProps, message, Spin} from "antd";
import React, {PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-query";
import {IFormContext, IFormError, IFormErrorHandler, IFormErrorMap, IFormInitialMapper, IFormMutationMapper, IFormOnFailure, IFormOnSuccess, IFormOnValuesChanged, IMutationHook, INavigate, IQueryParams, IToError} from "@leight-core/api";
import {FormProvider, isCallable, ItemGroupProvider, LoaderIcon, useBlockContext, useFormBlockContext, useFormContext, useNavigate, useOptionalDrawerContext} from "@leight-core/client";

export interface IFormProps<TRequest, TResponse, TQuery extends IQueryParams | void = void> extends Partial<Omit<FormProps, "onValuesChange">> {
	translation?: string;
	/**
	 * What to do on form submit.
	 */
	useMutation?: IMutationHook<TRequest, TResponse, TQuery>;
	mutationQuery?: TQuery;
	/**
	 * Map form data to mutation data.
	 */
	toMutation?: IFormMutationMapper<any, TRequest>;
	/**
	 * Map data to the initial state of the form (if any).
	 */
	toForm?: IFormInitialMapper<any>;
	/**
	 * Called when a form is successfully committed.
	 */
	onSuccess?: IFormOnSuccess<any, TResponse>;
	/**
	 * Called when an error occurs.
	 */
	onFailure?: IFormOnFailure<any>;
	/**
	 * Map error from outside to a state in the form (like a general error or a field error).
	 */
	toError?: (error: IToError<any, any>) => IFormErrorMap<any>;
	closeDrawer?: boolean;
	onValuesChange?: IFormOnValuesChanged;
}

const usePassThroughMutation: IMutationHook<any, any, any> = () => useMutation<any, any, any, any>(values => {
	return new Promise(resolve => resolve(values));
});

const FormInternal = <TRequest, TResponse, TQuery extends IQueryParams | void = void>(
	{
		useMutation = usePassThroughMutation,
		mutationQuery,
		toMutation = values => values,
		toForm = () => null as any,
		onSuccess = () => null,
		toError = () => ({}),
		onFailure,
		closeDrawer = true,
		onValuesChange,
		children,
		...props
	}: PropsWithChildren<IFormProps<TRequest, TResponse, TQuery>>) => {
	const formContext = useFormContext();
	const blockContext = useBlockContext();
	const formBlockContext = useFormBlockContext();
	const drawerContext = useOptionalDrawerContext();
	const doNavigate = useNavigate();
	const {t} = useTranslation();

	const mutation = useMutation(mutationQuery, {
		onSettled: () => {
			blockContext.unblock();
			formBlockContext.unblock();
		}
	});

	const navigate: INavigate = (href, query) => {
		blockContext.block();
		doNavigate(href, query);
	};

	function handleError(formError: IFormError | IFormErrorHandler<any, any>, error: any, formContext: IFormContext) {
		let handle = formError;
		if (!isCallable(handle)) {
			handle = () => formContext.setErrors({
				errors: [
					(formError as IFormError),
				],
			});
		}
		(handle as IFormErrorHandler<any, any>)({error, formContext});
	}

	onFailure = onFailure || (({error, formContext}) => {
		const map = toError({error, formContext});
		const formError = map[error];
		const general = map["general"];
		formError && handleError(formError, error, formContext);
		!formError && general && handleError(general, error, formContext);
		message.error(t("error." + error));
	});

	return <CoolForm
		layout={"vertical"}
		form={formContext.form}
		colon={false}
		size={"large"}
		onFinish={values => {
			blockContext.block();
			formBlockContext.block();
			mutation.mutate(toMutation(values), {
				onSuccess: response => {
					blockContext.unblock();
					formBlockContext.unblock();
					closeDrawer && drawerContext?.hide();
					onSuccess({navigate, values, response, formContext});
				},
				onError: error => onFailure && onFailure({error: (error && error.response && error.response.data) || error, formContext}),
			});
		}}
		labelAlign={"left"}
		scrollToFirstError
		initialValues={toForm()}
		onValuesChange={(changed, values) => onValuesChange?.({values, changed, formContext})}
		{...props}
	>
		<Spin indicator={<LoaderIcon/>} spinning={formBlockContext.isBlocked()}>
			{children}
		</Spin>
	</CoolForm>;
};

export function Form<TRequest = any, TResponse = void, TQuery extends IQueryParams | void = void>({translation, ...props}: PropsWithChildren<IFormProps<TRequest, TResponse, TQuery>>): JSX.Element {
	return <FormProvider translation={translation}>
		<ItemGroupProvider prefix={[]}>
			<FormInternal<TRequest, TResponse, TQuery> {...props}/>
		</ItemGroupProvider>
	</FormProvider>;
}
