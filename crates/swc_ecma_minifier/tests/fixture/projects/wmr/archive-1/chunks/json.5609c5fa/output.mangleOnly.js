import { a as n, y as o, m as t } from "../index.f66dda46.js";
const i = {
    foo: 42,
    bar: "bar"
};
function r() {
    const [r, e] = n(null);
    o(()=>{
        fetch("./pages/foo.json").then((n)=>n.json()).then((n)=>e(n));
    }, []);
    return t`<div><p>import: ${JSON.stringify(i)}</p><p>fetch: ${JSON.stringify(r)}</p></div>`;
}
export { r as JSONView };
