import "../index.f66dda46.js";
import { t as t } from "./hoofd.module.6c5395cb.js";
function e(t, e) {
    return import("../prerender.daa73035/input.js").then((n)=>n.default(t, e));
}
async function n(n) {
    const a = await e(n);
    const r = t();
    const o = new Set([
        ...r.links.map((t)=>({
                type: "link",
                props: t
            })),
        ...r.metas.map((t)=>({
                type: "meta",
                props: t
            })),
        ...r.scripts.map((t)=>({
                type: "script",
                props: t
            })), 
    ]);
    return {
        ...a,
        data: {
            hello: "world"
        },
        head: {
            title: r.title,
            lang: r.lang,
            elements: o
        }
    };
}
export { n as prerender };
