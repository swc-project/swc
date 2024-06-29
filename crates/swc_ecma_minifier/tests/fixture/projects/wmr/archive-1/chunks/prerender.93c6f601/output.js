import { t as toStatic } from "./hoofd.module.6c5395cb.js";
async function prerender(vnode) {
    const res = await import("../prerender.daa73035/input.js").then((m)=>m.default(vnode, void 0)), head = toStatic(), elements = new Set([
        ...head.links.map((props)=>({
                type: "link",
                props
            })),
        ...head.metas.map((props)=>({
                type: "meta",
                props
            })),
        ...head.scripts.map((props)=>({
                type: "script",
                props
            }))
    ]);
    return {
        ...res,
        data: {
            hello: "world"
        },
        head: {
            title: head.title,
            lang: head.lang,
            elements
        }
    };
}
import "../index.f66dda46.js";
import "./hoofd.module.6c5395cb.js";
export { prerender as prerender };
