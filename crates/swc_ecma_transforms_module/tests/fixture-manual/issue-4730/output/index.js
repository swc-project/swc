import { displayB } from "$DIR/tests/fixture-manual/issue-4730/input/packages/b/src/index";
async function display() {
    const displayA = await import("$DIR/tests/fixture-manual/issue-4730/input/packages/a/src/index").then((c)=>c.displayA);
    console.log(displayA());
    console.log(displayB());
}
display();
