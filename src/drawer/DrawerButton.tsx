import {Drawer, DrawerContext, DrawerProvider, useIsMobile} from "@leight-core/client";
import {Button, ButtonProps, DrawerProps} from "antd";
import {PushState} from "antd/lib/drawer";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {PlacementType} from "@leight-core/api";

export interface IDrawerButtonProps extends Partial<ButtonProps> {
	label?: ReactNode;
	title?: string;
	/**
	 * Optional drawer width.
	 */
	width?: string | number;
	height?: string | number;
	drawerProps?: DrawerProps;
	placement?: PlacementType;
	push?: boolean | PushState;
	fullscreen?: boolean;
}

/**
 * Default Antd button without any preset; just the drawer is shown on click.
 */
export const DrawerButton: FC<IDrawerButtonProps> = ({children, onClick, label, title, width = 600, height, placement = "left", push = false, fullscreen = false, drawerProps, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	fullscreen && (width = "100vw") && (height = "100vh");
	return <DrawerProvider>
		<DrawerContext.Consumer>
			{drawerContext => <>
				<Drawer
					title={title ? t(title) : null}
					width={isMobile ? "100vw" : width}
					height={height}
					headerStyle={isMobile ? {padding: "8px 4px"} : undefined}
					bodyStyle={{overflowY: "scroll", padding: isMobile ? "4px" : undefined}}
					placement={placement}
					push={push}
					{...drawerProps}
				>
					{children}
				</Drawer>
				<Button
					onClick={event => {
						drawerContext.setVisible(true);
						onClick?.(event);
					}}
					{...props}
				>
					{title ? t(title) : label}
				</Button>
			</>}
		</DrawerContext.Consumer>
	</DrawerProvider>;
};
