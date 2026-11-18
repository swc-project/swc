import { count, bump } from "data:text/javascript,export let count=0;export function bump(){return ++count}";

const result = bump();
const pair = [count, result];
export { pair };
console.log(pair.join(" "));
