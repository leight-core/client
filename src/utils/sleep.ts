export const sleep = async (sleep?: number) => {
	sleep && (await new Promise(resolve => setTimeout(resolve, sleep)));
};
