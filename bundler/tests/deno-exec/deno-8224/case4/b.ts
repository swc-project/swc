import { showValue } from "./a";

export const showList = (v: number[]): string => {
    return `[${v.map(showValue).join(', ')}]`;
};