import { count } from "data:text/javascript,export let count=0";
import * as ns from "data:text/javascript,export let count=0";

export function read() {
    const snapshot = count;
    return snapshot;
}

export function namespace() {
    const alias = ns;
    return () => alias;
}

console.log(read(), namespace()() === ns);
