import {IMobileFormItemContext, INamePath} from "@leight-core/api";
import {MobileFormItemContext, ShowToken, useMobileFormContext, useOptionalItemGroupContext, useOptionalVisibleContext} from "@leight-core/client";
import {Form, Input} from "antd-mobile";
import {Rule} from "rc-field-form/lib/interface";
import {ComponentProps, FC} from "react";
import {useTranslation} from "react-i18next";

export interface IMobileFormItemProps extends Partial<ComponentProps<typeof Form["Item"]>> {
	/**
	 * Field name; also used for translations.
	 */
	field: INamePath;
	/**
	 * Attach required validation rule?
	 */
	required?: boolean;
	/**
	 * Show Antd Form.Item label.
	 */
	showLabel?: boolean;
	hasTooltip?: boolean;
	labels?: string[] | string;
	withHelp?: boolean;
	showWith?: string[];
	withVisible?: boolean;

	onNormalize?(value: any, formItemContext: IMobileFormItemContext): void,
}

export const MobileFormItem: FC<IMobileFormItemProps> = (
	{
		field,
		required = false,
		showLabel = true,
		hasTooltip = false,
		withVisible = false,
		children = <Input/>,
		labels = [],
		withHelp = false,
		showWith,
		onNormalize,
		...props
	}) => {
	const {t} = useTranslation();
	const formContext = useMobileFormContext();
	const itemGroupContext = useOptionalItemGroupContext();
	const visibleContext = useOptionalVisibleContext();
	field = ([] as (string | number)[]).concat(itemGroupContext?.prefix || [], Array.isArray(field) ? field : [field]);
	const fieldName = Array.isArray(field) ? field.join(".") : field;
	const rules: Rule[] = [];
	labels = Array.isArray(labels) ? labels : [labels];
	props.help = props.help ? t("" + props.help) : props.help;
	formContext.translation && hasTooltip && (props.help = t(formContext.translation + "." + fieldName + ".label.tooltip"));
	itemGroupContext?.translation && hasTooltip && (props.help = t(itemGroupContext.translation + "." + fieldName + ".label.tooltip"));
	formContext.translation && labels.push(formContext.translation + "." + fieldName + ".label");
	itemGroupContext?.translation && labels.push(itemGroupContext.translation + "." + fieldName + ".label");
	required && rules.push({
		required: true,
		message: t(["form-item." + fieldName + ".required"].concat(labels.map(item => item + ".required"))) as string,
	});
	/**
	 * This is... a hack I really don't understand!
	 * But it works.
	 *
	 * The idea is to clear errors set from form context, and this solution could do that with ease!
	 */
	rules.push(() => ({validator: () => Promise.resolve()}));
	formContext.translation && withHelp && (props.help = t(formContext.translation + "." + fieldName + ".label.help"));
	itemGroupContext?.translation && withHelp && (props.help = t(itemGroupContext.translation + "." + fieldName + ".label.help"));
	const context: IMobileFormItemContext = {
		field,
		label: t(["form-item." + fieldName + ".label"].concat(labels)) as string,
		getValue: () => formContext.form.getFieldValue(field),
		setValue: value => formContext.form.setFields([{name: field, value}]),
		setErrors: (errors: string[]) => {
			setTimeout(() => {
				formContext.form.setFields([{name: field, errors: errors.map(item => t(item))}]);
			}, 0);
		},
	};
	onNormalize && !props.normalize && (props.normalize = value => onNormalize(value, context));
	return <ShowToken tokens={showWith}>
		<MobileFormItemContext.Provider value={context}>
			<Form.Item
				name={field}
				label={showLabel === false ? null : t(["form-item." + fieldName + ".label"].concat(labels))}
				rules={rules}
				onClick={withVisible && visibleContext ? () => visibleContext?.show() : undefined}
				{...props}
			>
				{children}
			</Form.Item>
		</MobileFormItemContext.Provider>
	</ShowToken>;
};
