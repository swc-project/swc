import "../index.f66dda46.js";
import { t as toStatic } from "./hoofd.module.6c5395cb.js";
function prerender$1(vnode, options) {
    return import("../prerender.daa73035/input.js").then((m)=>m.default(vnode, options)
    );
}
async function prerender(vnode) {
    let res = await prerender$1(vnode), head = toStatic(), elements = new Set([
        ...head.links.map((props)=>({
                type: "link",
                props
            })
        ),
        ...head.metas.map((props)=>({
                type: "meta",
                props
            })
        ),
        ...head.scripts.map((props)=>({
                type: "script",
                props
            })
        ), 
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
export { prerender };
