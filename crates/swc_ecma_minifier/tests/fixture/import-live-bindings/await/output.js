import { count, bump } from "data:text/javascript,export let count=0;export function bump(){count++}";
export async function changed(f) {
    let before = count;
    return await f(), before !== count;
}
console.log(await changed(bump), await changed(()=>{}));
