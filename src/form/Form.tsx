import {
	IFormContext,
	IFormError,
	IFormErrorHandler,
	IFormErrorMap,
	IFormInitialMapper,
	IFormMutationMapper,
	IFormOnChanged,
	IFormOnFailure,
	IFormOnSuccess,
	IFormOnValuesChanged,
	IMutationHook,
	INavigate,
	IQueryParams,
	IToError
} from "@leight-core/api";
import {FormProvider, ItemGroupProvider, LoaderIcon, useBlockContext, useFormBlockContext, useFormContext, useNavigate, useOptionalDrawerContext, WithToken} from "@leight-core/client";
import {isCallable} from "@leight-core/utils";
import {useMutation} from "@tanstack/react-query";
import {Form as CoolForm, message, Spin} from "antd";
import React, {ComponentProps} from "react";
import {useTranslation} from "react-i18next";

export interface IFormProps<TRequest, TResponse, TQueryParams extends IQueryParams = any> extends Partial<Omit<ComponentProps<typeof CoolForm>, "onValuesChange" | "onChange">> {
	/**
	 * Base translation used in the whole form; extremely simplifies translations.
	 */
	translation?: string;

	/**
	 * What to do on form submit.
	 */
	useMutation?: IMutationHook<TRequest, TResponse, TQueryParams>;
	mutationQueryParams?: TQueryParams;
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
	/**
	 * If the form is used under a drawer, this flag controls if it should be automatically closed on success.
	 */
	closeDrawer?: boolean;
	onValuesChange?: IFormOnValuesChanged;
	onChange?: IFormOnChanged;
	/**
	 * Optional ACL check - if specified, user must possess any of the given token.
	 */
	tokens?: string[];
	/**
	 * Props for the WithToken component.
	 */
	withTokenProps?: ComponentProps<typeof WithToken>;
}

const usePassThroughMutation: IMutationHook<any, any> = () => useMutation<any, any, any, any>(values => new Promise(resolve => resolve(values)));

const FormInternal = <TRequest, TResponse, TQueryParams extends IQueryParams>(
	{
		useMutation = usePassThroughMutation,
		mutationQueryParams,
		toMutation = values => values,
		toForm = () => null as any,
		onSuccess = () => null,
		toError = () => ({}),
		onFailure,
		closeDrawer = true,
		onValuesChange,
		onChange,
		children,
		...props
	}: IFormProps<TRequest, TResponse, TQueryParams>) => {
	const formContext = useFormContext();
	const blockContext = useBlockContext();
	const formBlockContext = useFormBlockContext();
	const drawerContext = useOptionalDrawerContext();
	const doNavigate = useNavigate();
	const {t} = useTranslation();

	const mutation = useMutation(mutationQueryParams, {
		onSettled: () => {
			blockContext.unblock();
			formBlockContext.unblock();
		}
	});

	const navigate: INavigate = (href, queryParams) => {
		blockContext.block();
		doNavigate(href, queryParams);
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
					closeDrawer && drawerContext?.close();
					onSuccess({
						navigate,
						values,
						response,
						formContext,
						t: (text, data) => t(formContext.translation ? `${formContext.translation}.${text}` : text, data),
					});
				},
				onError: error => onFailure?.({error: (error && error.response && error.response.data) || error, formContext}),
			});
		}}
		labelAlign={"left"}
		scrollToFirstError
		initialValues={toForm()}
		onFieldsChange={() => onChange?.({values: formContext.values(), formContext})}
		onValuesChange={(changed, values) => onValuesChange?.({values, changed, formContext})}
		{...props}
	>
		<Spin indicator={<LoaderIcon/>} spinning={formBlockContext.isBlocked()}>
			{children}
		</Spin>
	</CoolForm>;
};

/**
 * Simple but powerful Antd Form wrapper providing some extra cool features like Token checks on a user or translations and many more.
 */
export function Form<TRequest = any, TResponse = void, TQueryParams extends IQueryParams = any>(
	{
		translation,
		tokens,
		withTokenProps,
		...props
	}: IFormProps<TRequest, TResponse, TQueryParams>): JSX.Element {
	return <WithToken
		tokens={tokens}
		label={translation ? `${translation}.403` : undefined}
		{...withTokenProps}
	>
		<FormProvider
			translation={translation}
		>
			<ItemGroupProvider prefix={[]}>
				<FormInternal<TRequest, TResponse, TQueryParams> {...props}/>
			</ItemGroupProvider>
		</FormProvider>
	</WithToken>;
}
