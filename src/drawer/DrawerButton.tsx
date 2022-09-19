import {PlacementType} from "@leight-core/api";
import {Drawer, DrawerContext, DrawerProvider, useMobile, UseToken} from "@leight-core/client";
import {isString} from "@leight-core/utils";
import {Button, ButtonProps, DrawerProps, Tooltip} from "antd";
import {PushState} from "antd/lib/drawer";
import {ComponentProps, FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IDrawerButtonProps extends Partial<ButtonProps> {
	label?: ReactNode | string;
	title?: string;
	values?: Record<string, any>;
	tooltip?: string;
	/**
	 * Optional drawer width.
	 */
	width?: string | number;
	height?: string | number;
	drawerProps?: DrawerProps;
	placement?: PlacementType;
	push?: boolean | PushState;
	fullscreen?: boolean;
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
		height,
		placement = "right",
		push = false,
		fullscreen = false,
		drawerProps,
		tokens,
		...props
	}) => {
	const {t} = useTranslation();
	const mobile = useMobile();
	fullscreen && (width = "100vw") && (height = "100vh");
	return <Tooltip title={tooltip ? t(tooltip) : undefined}>
		<DrawerProvider>
			<DrawerContext.Consumer>
				{drawerContext => <>
					<Drawer
						title={title ? t(title, values) : null}
						width={mobile("100vw", width)}
						height={height}
						headerStyle={mobile({padding: "8px 4px"})}
						bodyStyle={{overflowY: "scroll", padding: mobile("0 1.25em")}}
						placement={placement}
						push={push}
						{...drawerProps}
					>
						{children}
					</Drawer>
					<UseToken tokens={tokens}>
						<Button
							onClick={event => {
								drawerContext.setOpen(true);
								onClick?.(event);
							}}
							{...props}
						>
							{isString(label) ? t(label as string, {values}) : label}
						</Button>
					</UseToken>
				</>}
			</DrawerContext.Consumer>
		</DrawerProvider>
	</Tooltip>;
};
