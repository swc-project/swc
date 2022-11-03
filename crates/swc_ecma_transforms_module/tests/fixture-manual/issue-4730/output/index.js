import { displayB } from "../packages/b/src/index.ts";
async function display() {
    const displayA = await import("../packages/a/src/index.ts").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
}
display();
