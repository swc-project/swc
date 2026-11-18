import { count, bump } from "data:text/javascript,export let count=0;export function bump(){return ++count}";
let result = bump(), pair = [
    count,
    result
];
console.log(pair.join(" "));
export { pair };
