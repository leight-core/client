import {Drawer, IDrawerProps, Translate, UseToken, VisibleContext, VisibleProvider} from "@leight-core/client";
import {Button, ButtonProps, Tooltip} from "antd";
import {ComponentProps, FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IDrawerButtonProps extends Partial<Omit<ButtonProps, "title">> {
	label?: ReactNode | string;
	title?: ReactNode;
	values?: Record<string, any>;
	tooltip?: string;
	width?: string | number;
	drawerProps?: IDrawerProps;
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

/**
 * Default Antd button without any preset; just the drawer is shown on click.
 */
export const DrawerButton: FC<IDrawerButtonProps> = (
	{
		children,
		onClick,
		label,
		title,
		tooltip,
		values,
		width = 600,
		drawerProps,
		tokens,
		...props
	}) => {
	const {t} = useTranslation();
	return <Tooltip title={tooltip ? t(tooltip) : undefined}>
		<VisibleProvider>
			<VisibleContext.Consumer>
				{visibleContext => <>
					<Drawer
						title={title}
						values={values}
						width={width}
						{...drawerProps}
					>
						{children}
					</Drawer>
					<UseToken tokens={tokens}>
						<Button
							onClick={event => {
								visibleContext.show();
								onClick?.(event);
							}}
							{...props}
						>
							<Translate text={label} values={values}/>
						</Button>
					</UseToken>
				</>}
			</VisibleContext.Consumer>
		</VisibleProvider>
	</Tooltip>;
};
