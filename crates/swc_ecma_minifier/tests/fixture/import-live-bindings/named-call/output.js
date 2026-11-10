import { count, bump } from "data:text/javascript,export let count=0;export function bump(){count++}";
export function changed(f) {
    let before = count;
    return f(), before !== count;
}
console.log(changed(bump), changed(()=>{}));
