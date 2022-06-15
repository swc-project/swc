import "../index.f66dda46.js";
import { t as a } from "./hoofd.module.6c5395cb.js";
function b(a, b) {
    return import("../prerender.daa73035/input.js").then((c)=>c.default(a, b));
}
async function c(c) {
    const d = await b(c);
    const e = a();
    const f = new Set([
        ...e.links.map((a)=>({
                type: "link",
                props: a
            })),
        ...e.metas.map((a)=>({
                type: "meta",
                props: a
            })),
        ...e.scripts.map((a)=>({
                type: "script",
                props: a
            })), 
    ]);
    return {
        ...d,
        data: {
            hello: "world"
        },
        head: {
            title: e.title,
            lang: e.lang,
            elements: f
        }
    };
}
export { c as prerender };
