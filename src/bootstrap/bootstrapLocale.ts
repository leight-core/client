import {ILocaleConfig} from "@leight-core/api";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import enEN from 'antd/lib/locale/en_US';
import dayjs from "dayjs";
import localeMap from './locale.json';
import moment from "moment";

export const bootstrapLocale = async (language: string): Promise<ILocaleConfig> => {
	await i18n
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			initImmediate: true,
			resources: {
				translation: {
					translation: {
						"translation.check": "",
					},
				},
				cs: {
					translation: {
						"common.loading": "",
					}
				},
				en: {
					translation: {
						"common.loading": "",
					}
				}
			},
			keySeparator: false,
			nsSeparator: false,
			interpolation: {
				escapeValue: false,
			},
		});

	dayjs.extend(require("dayjs/plugin/duration"));
	dayjs.extend(require("dayjs/plugin/localeData"));
	dayjs.extend(require("dayjs/plugin/localizedFormat"));
	dayjs.extend(require("dayjs/plugin/relativeTime"));
	dayjs.extend(require("dayjs/plugin/utc"));

	const locale = (localeMap as any)[language] || {'short': 'en', 'long': 'en_US'};
	return new Promise<{ antd: any }>(resolver => {
		import(`dayjs/locale/${locale.short}.js`)
			.then(() => dayjs.locale(locale.short))
			.catch(() => console.log(`Cannot import [dayjs/locale/${locale.short}.js].`));
		import(`moment/locale/${locale.short}.js`)
			.then(() => moment.locale(locale.short))
			.catch(() => console.log(`Cannot import [moment/locale/${locale.short}.js].`));
		import(`antd/lib/locale/${locale.long}.js`)
			.then(antd => resolver({antd: antd.default}))
			.catch(e => {
				console.error(e);
				resolver({antd: enEN});
			});
	});
};