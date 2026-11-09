import { count, bump } from "data:text/javascript,export let count=0;export function bump(){count++}";

export async function changed(f) {
    const before = count;
    await f();
    return before !== count;
}

console.log(await changed(bump), await changed(() => {}));
