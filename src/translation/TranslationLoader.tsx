import {TranslationOutlined} from "@ant-design/icons";
import {FC, ReactNode, useEffect, useState} from "react";
import {LoaderLayout, useI18NextContext} from "@leight-core/client";
import {ITranslationsQuery} from "@leight-core/api";

export interface ITranslationLoaderProps {
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
			result.data.translations.forEach(translation => i18next.addResource(translation.language, "translation", translation.label, translation.text));
			setIsLoading(false);
		}
	}, [result.isSuccess, result.data]);
	return <LoaderLayout
		logo={logo}
		icon={<TranslationOutlined/>}
		loading={isLoading}
		queryResult={result}
		errorText={"Translations cannot be loaded."}
		{...props}
	/>;
};
