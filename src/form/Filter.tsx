import {CloseCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {Centered, DrawerButton, Form, IDrawerButtonProps, IFormProps, Submit, useFilterContext, useFormContext, useOptionalCursorContext, useOptionalDrawerContext} from "@leight-core/client";
import {Button, Divider, Space, SpaceProps} from "antd";
import {FC, PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

type IFilterInternalProps = PropsWithChildren<{
	onClear?: () => void;
}>;

const FilterInternal: FC<IFilterInternalProps> = ({onClear, children}) => {
	const {t} = useTranslation();
	const formContext = useFormContext();
	const filterContext = useFilterContext();
	return <>
		{children}
		<Divider/>
		<Centered>
			<Space align={"baseline"} split={<Divider type={"vertical"}/>} size={"large"}>
				{!filterContext.isEmpty() && <Button
					type={"link"}
					onClick={() => {
						formContext.reset();
						filterContext.setFilter();
						onClear?.();
					}}
					icon={<CloseCircleOutlined/>}
				>
					{t("common.filter.clear")}
				</Button>}
				<Submit
					icon={<SearchOutlined/>}
					label={t("common.filter.submit")}
				/>
			</Space>
		</Centered>
	</>;
};

type IFilterFormProps<TFilter> = {
	translation: string;
	formProps?: Partial<IFormProps<TFilter, TFilter>>;

	toFilter(values: any): TFilter | undefined;

	toForm?(filter?: TFilter, source?: any): any;
} & IFilterInternalProps;

const FilterForm = <TFilter, >({translation, onClear, formProps, toForm = filter => filter, toFilter, ...props}: IFilterFormProps<TFilter>) => {
	const drawerContext = useOptionalDrawerContext();
	const filterContext = useFilterContext<TFilter>();
	const cursorContext = useOptionalCursorContext();

	return <Form<TFilter, TFilter>
		layout={"vertical"}
		toForm={() => filterContext.source || toForm(filterContext.filter, filterContext.source)}
		onSuccess={({response}) => {
			cursorContext?.setPage(0);
			filterContext.setFilter(toFilter(response), response);
			drawerContext?.setVisible(false);
		}}
		translation={translation + ".filter"}
		{...formProps}
	>
		<FilterInternal
			onClear={() => {
				drawerContext?.setVisible(false);
				onClear && onClear();
			}}
			{...props}
		/>
	</Form>;
};

export type IFilterProps<TFilter = any> = {
	inline?: boolean;
	translation: string;
	drawerButtonProps?: IDrawerButtonProps;
	spaceProps?: Partial<SpaceProps>;
} & IFilterFormProps<TFilter>

export type IFilterWithoutTranslationProps<TFilter = any> = Omit<IFilterProps<TFilter>, "translation">;

export function Filter<TFilter = any>({inline = false, translation, onClear, drawerButtonProps, formProps, toForm = filter => filter, toFilter, spaceProps, ...props}: IFilterProps<TFilter>): JSX.Element {
	const {t} = useTranslation();
	const filterContext = useFilterContext<TFilter>();
	const cursorContext = useOptionalCursorContext();
	return inline ?
		<FilterForm
			translation={translation}
			formProps={formProps}
			toForm={toForm}
			toFilter={toFilter}
			{...props}
		/> :
		<Space align={"baseline"} split={<Divider type={"vertical"}/>} {...spaceProps}>
			<DrawerButton
				icon={<SearchOutlined/>}
				type={"link"}
				size={"small"}
				title={translation + ".filter.title"}
				label={translation + ".filter.title"}
				width={750}
				{...drawerButtonProps}
			>
				<FilterForm
					translation={translation}
					formProps={formProps}
					toForm={toForm}
					toFilter={toFilter}
					{...props}
				/>
			</DrawerButton>
			{!filterContext.isEmpty() && <Button
				type={"link"}
				size={"small"}
				onClick={() => {
					cursorContext?.setPage(0);
					filterContext.setFilter();
					onClear?.();
				}}
				icon={<CloseCircleOutlined/>}
			>
				{t("common.filter.clear")}
			</Button>}
		</Space>;
}
