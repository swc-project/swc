import * as F from "foo";
import type { Thing } from "anywhere";
console.log(F)

export const inner = <F>(a: F) => {
    console.log(F)
};