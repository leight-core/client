import {TranslationOutlined} from "@ant-design/icons";
import {FC, ReactNode, useEffect, useState} from "react";
import {ILoaderLayoutProps, LoaderLayout, useI18NextContext} from "@leight-core/client";
import {ITranslations, ITranslationsQuery} from "@leight-core/api";

export interface ITranslationLoaderProps extends Partial<ILoaderLayoutProps<ITranslations>> {
	useQuery?: ITranslationsQuery;
	logo?: ReactNode;
}

export const TranslationLoader: FC<ITranslationLoaderProps> = ({useQuery, logo, ...props}) => {
	if (!useQuery) {
		return <>{props.children}</>
	}
	const result = useQuery();
	const {i18next} = useI18NextContext();
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (result.isSuccess) {
			i18next.addResources(result.data.language, result.data.namespace, result.data.translations);
			setIsLoading(false);
		}
	}, [result.isSuccess, result.data]);
	return <LoaderLayout
		logo={logo}
		icon={<TranslationOutlined/>}
		loading={isLoading}
		result={result.data}
		errorText={"Translations cannot be loaded."}
		{...props}
	/>;
};
