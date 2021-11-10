import {
    m,
} from "../index.f66dda46.js";
const value$1 = "it works";
const value = "it works";
function AliasOutside(
) {
    return m`<div><p>Inside: ${value}</p><p>Outside: ${value$1}</p></div>`;
}
export default AliasOutside;
