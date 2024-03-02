import { displayB } from "../packages/b/src/index.js";
async function display() {
    const displayA = await import("../packages/a/src/index.js").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
}
display();
