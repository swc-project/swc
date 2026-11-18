import * as ns from "data:text/javascript,export let count=0;export function bump(){count++}";

export function changed(f) {
    const before = ns.count;
    f();
    return before !== ns.count;
}

console.log(changed(ns.bump), changed(() => {}));
