import { displayB } from "../packages/b/src";
async function display() {
    const displayA = await import("../packages/a/src").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
}
display();
