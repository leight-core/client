import {LoaderLayout, useBootstrap} from "@leight-core/client";
import {FC, ReactNode, useState} from "react";
import {IBootstrapConfig} from "@leight-core/api";
import {ConfigProvider} from "antd";
import type {ConfigProviderProps} from "antd/lib/config-provider";

export interface IBootstrapLoaderProps extends ConfigProviderProps {
	icon: ReactNode;
}

export const BootstrapLoader: FC<IBootstrapLoaderProps> = ({icon, ...props}) => {
	const [bootstrapConfig, setBootstrapConfig] = useState<IBootstrapConfig>();
	useBootstrap(setBootstrapConfig);
	return <LoaderLayout<IBootstrapConfig>
		icon={icon}
		result={bootstrapConfig}
		loading={!bootstrapConfig}
	>
		{bootstrapConfig => <ConfigProvider locale={bootstrapConfig.locale.antd} {...props}/>}
	</LoaderLayout>
}
