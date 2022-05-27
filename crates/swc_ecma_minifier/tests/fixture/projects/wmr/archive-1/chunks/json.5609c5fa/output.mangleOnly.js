import { a as b, y as c, m as d } from "../index.f66dda46.js";
const e = {
    foo: 42,
    bar: "bar"
};
function a() {
    const [a, f] = b(null);
    c(()=>{
        fetch("./pages/foo.json").then((a)=>a.json()).then((a)=>f(a));
    }, []);
    return d`<div><p>import: ${JSON.stringify(e)}</p><p>fetch: ${JSON.stringify(a)}</p></div>`;
}
export { a as JSONView };
