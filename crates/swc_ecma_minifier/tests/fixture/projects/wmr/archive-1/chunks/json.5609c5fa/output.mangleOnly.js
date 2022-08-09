import { a as t, y as n, m as i } from "../index.f66dda46.js";
const o = {
    foo: 42,
    bar: "bar"
};
function r() {
    const [r, p] = t(null);
    n(()=>{
        fetch("./pages/foo.json").then((t)=>t.json()).then((t)=>p(t));
    }, []);
    return i`<div><p>import: ${JSON.stringify(o)}</p><p>fetch: ${JSON.stringify(r)}</p></div>`;
}
export { r as JSONView };
