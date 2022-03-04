import humanizeDuration, {Options} from "humanize-duration";
import i18next from "i18next";

const humanizer = humanizeDuration.humanizer({
	language: i18next.language,
	fallbacks: ["en"],
	largest: 3,
	round: true,
	maxDecimalPoints: 2,
});

export const miliDuration = (milis: number | string, options?: Options) => {
	return humanizer(parseFloat(milis as any), options);
};

export const secDuration = (secs: number | string, options?: Options) => {
	return miliDuration(parseFloat(secs as any) * 1000, options);
};
