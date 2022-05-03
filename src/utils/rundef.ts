import cleaner from "fast-clean";

export const rundef = (obj: any) => cleaner.clean(obj || {}, {
	nullCleaner: false,
});
