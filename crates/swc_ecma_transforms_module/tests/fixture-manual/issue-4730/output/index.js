import { displayB } from "../packages/b/src/index";
async function display() {
    const displayA = await import("../packages/a/src/index").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
}
display();
