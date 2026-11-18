import { count } from "data:text/javascript,export let count=0";
import * as ns from "data:text/javascript,export let count=0";
export function read() {
    return count;
}
export function namespace() {
    return ()=>ns;
}
console.log(read(), namespace()() === ns);
