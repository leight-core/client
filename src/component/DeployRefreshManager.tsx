import {FC, useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {IQueryHook} from "@leight-core/api";
import {Button, Modal} from "antd";
import {ReloadOutlined} from "@ant-design/icons";

export interface IDeployRefreshManagerProps {
	useVersionQuery: IQueryHook<void, string>;
}

export const DeployRefreshManager: FC<IDeployRefreshManagerProps> = ({useVersionQuery, children}) => {
	const {t} = useTranslation();
	const [version, setVersion] = useState(false);
	const versionQuery = useVersionQuery(undefined, undefined, {
		refetchInterval: 5000,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
	});
	useEffect(() => {
		setVersion(versionQuery.data ? versionQuery.data !== process.env.NEXT_PUBLIC_VERSION : false);
	}, [versionQuery.data]);
	// noinspection SillyAssignmentJS
	return <>
		<Modal
			visible={version}
			title={t("common.new.version.title", {data: {version: versionQuery.data}})}
			footer={<Button
				type={"primary"}
				size={"large"}
				icon={<ReloadOutlined/>}
				onClick={() => (window.location.href = window.location.href)}
			>
				{t("common.new.version.reload")}
			</Button>}
		>
			<Trans i18nKey={"common.new.version.content"} values={{version: versionQuery.data}}/>
		</Modal>
		{children}
	</>;
};