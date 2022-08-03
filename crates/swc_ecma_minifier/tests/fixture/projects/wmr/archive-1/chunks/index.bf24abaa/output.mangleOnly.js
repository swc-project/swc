import { s as t, m as e } from "../index.f66dda46.js";
const r = {
    browser: true,
    env: {
        FOO: "bar",
        OVERRIDE: "11",
        EMPTY: "",
        FOO_LOCAL: "bar",
        NODE_ENV: "production"
    }
};
null;
const n = 42;
function o() {
    return e`<table><thead><tr><th>Name ${n}</th><th>Value</th></tr></thead><tbody>${Object.keys(r.env).sort().map((t)=>{
        return e`<tr key=${t}><td>${t}</td><td>${String(r.env[t])}</td></tr>`;
    })}</tbody></table>`;
}
export { o as Environment };
