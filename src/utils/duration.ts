import humanizeDuration, {Options} from "humanize-duration";
import i18next from "i18next";

const humanizer = humanizeDuration.humanizer({
	language: i18next.language,
	fallbacks: ["en"],
	largest: 3,
	round: true,
	maxDecimalPoints: 2,
});

export const toHumanTimeMs = (miliseconds: number | string, options?: Options) => humanizer(parseFloat(miliseconds as any), options);

export const toHumanTimeSec = (secs: number | string, options?: Options) => toHumanTimeMs(parseFloat(secs as any) * 1000, options);
