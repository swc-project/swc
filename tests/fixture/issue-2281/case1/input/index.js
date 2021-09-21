import { func1 } from "./src/func";

console.log(func1);

function something({ func = 0 }) {
    const haha = false;

    return func;
}