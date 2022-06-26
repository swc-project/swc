import { a as a, y as b, m as c } from "../index.f66dda46.js";
const d = {
    foo: 42,
    bar: "bar"
};
function e() {
    const [e, f] = a(null);
    b(()=>{
        fetch("./pages/foo.json").then((a)=>a.json()).then((a)=>f(a));
    }, []);
    return c`<div><p>import: ${JSON.stringify(d)}</p><p>fetch: ${JSON.stringify(e)}</p></div>`;
}
export { e as JSONView };
