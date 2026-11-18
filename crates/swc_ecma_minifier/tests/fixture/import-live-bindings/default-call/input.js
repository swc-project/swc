import count, { bump } from "data:text/javascript,let count=0;export{count as default};export function bump(){count++}";

export function changed(f) {
    const before = count;
    f();
    return before !== count;
}

console.log(changed(bump), changed(() => {}));
