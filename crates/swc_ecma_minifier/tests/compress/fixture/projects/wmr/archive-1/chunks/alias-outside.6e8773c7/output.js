import { m } from "../index.f66dda46.js";
let value$1 = "it works", value = "it works";
function AliasOutside() {
    return m`<div><p>Inside: ${"it works"}</p><p>Outside: ${"it works"}</p></div>`;
}
export default AliasOutside;
