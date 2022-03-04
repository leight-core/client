import {useBootstrap} from "@leight-core/client";
import {FC, useState} from "react";
import {IBootstrapConfig} from "@leight-core/api";
import {ConfigProvider} from "antd";
import type {ConfigProviderProps} from "antd/lib/config-provider";
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";

export interface IBootstrapLoaderProps extends ConfigProviderProps {
	session?: Session | null;
}

export const BootstrapLoader: FC<IBootstrapLoaderProps> = ({session, ...props}) => {
	const [bootstrapConfig, setBootstrapConfig] = useState<IBootstrapConfig>();
	useBootstrap(setBootstrapConfig);
	return <SessionProvider
		session={session}
		refetchOnWindowFocus={true}
	>
		{bootstrapConfig && <ConfigProvider locale={bootstrapConfig.locale.antd} {...props}/>}
	</SessionProvider>
}
