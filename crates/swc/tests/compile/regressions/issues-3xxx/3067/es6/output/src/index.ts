import { displayB } from "./inner/b/index.mjs";
import { displayC } from "../packages/c/src/index.mjs";
import { merge } from "lodash";
async function display() {
    const displayA = await import("./inner/a/index.mjs").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
    console.log(displayC());
    const foo = merge({}, {
        a: 22
    });
}
display();
