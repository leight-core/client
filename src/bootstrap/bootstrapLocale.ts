import {ILocaleConfig} from "@leight-core/api";
import enEN from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";
import {initReactI18next} from "react-i18next";
import locales from "./locale.json";

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

	const locale = (locales as any)[language] || {dayjs: "en-gb", moment: "en-gb", antd: "en_GB"};
	return new Promise<{ antd: any }>(resolver => {
		import(`dayjs/locale/${locale.dayjs}.js`)
			.then(() => dayjs.locale(locale.dayjs))
			.catch(() => console.log(`Cannot import [dayjs/locale/${locale.dayjs}.js].`));
		import(`moment/locale/${locale.moment}.js`)
			.then(() => moment.locale(locale.moment))
			.catch(() => console.log(`Cannot import [moment/locale/${locale.moment}.js].`));
		import(`antd/lib/locale/${locale.antd}.js`)
			.then(antd => resolver({antd: antd.default}))
			.catch(e => {
				console.error(e);
				resolver({antd: enEN});
			});
	});
};
