import { a as l } from "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
import { m } from "../index.f66dda46.js";
const json = {
    foo: 42,
    bar: "bar"
};
function JSONView() {
    const [fetched, setFetched] = l(null);
    return y(()=>{
        fetch("./pages/foo.json").then((r)=>r.json()).then((r)=>setFetched(r));
    }, []), m`<div><p>import: ${JSON.stringify(json)}</p><p>fetch: ${JSON.stringify(fetched)}</p></div>`;
}
import "../index.f66dda46.js";
export { JSONView as JSONView };
