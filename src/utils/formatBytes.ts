import fileSize from "filesize";

export const formatBytes = (size: number) => fileSize(size);
