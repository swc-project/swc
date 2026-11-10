import count, { bump } from "data:text/javascript,let count=0;export{count as default};export function bump(){count++}";
export function changed(f) {
    let before = count;
    return f(), before !== count;
}
console.log(changed(bump), changed(()=>{}));
