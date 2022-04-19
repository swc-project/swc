import { a as l, y, m } from "../index.f66dda46.js";
let json = {
    foo: 42,
    bar: "bar"
};
function JSONView() {
    let [fetched, setFetched, ] = l(null);
    return y(()=>{
        fetch("./pages/foo.json").then((r)=>r.json()
        ).then((r)=>setFetched(r)
        );
    }, []), m`<div><p>import: ${JSON.stringify(json)}</p><p>fetch: ${JSON.stringify(fetched)}</p></div>`;
}
export { JSONView };
