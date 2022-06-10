import "../index.f66dda46.js";
import { t as b } from "./hoofd.module.6c5395cb.js";
function c(a, b) {
    return import("../prerender.daa73035/input.js").then((c)=>c.default(a, b));
}
async function a(d) {
    const e = await c(d);
    const a = b();
    const f = new Set([
        ...a.links.map((a)=>({
                type: "link",
                props: a
            })),
        ...a.metas.map((a)=>({
                type: "meta",
                props: a
            })),
        ...a.scripts.map((a)=>({
                type: "script",
                props: a
            })), 
    ]);
    return {
        ...e,
        data: {
            hello: "world"
        },
        head: {
            title: a.title,
            lang: a.lang,
            elements: f
        }
    };
}
export { a as prerender };
