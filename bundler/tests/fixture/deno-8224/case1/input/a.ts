import { showList } from "./b";

export const showValue = (v: number): string => {
    if (v === 0) {
        return showList([v]);
    }

    return `${v}`;
};

console.log(showList([1, 2, 3]));
