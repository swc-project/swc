import { count, bump } from "data:text/javascript,export let count=0;export function bump(){count++}";

export function changed(f) {
    const before = count;
    f();
    return before !== count;
}

console.log(changed(bump), changed(() => {}));
