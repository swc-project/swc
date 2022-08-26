import { s as t, m as r } from "../index.f66dda46.js";
const e = {
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
    return r`<table><thead><tr><th>Name ${n}</th><th>Value</th></tr></thead><tbody>${Object.keys(e.env).sort().map((t)=>{
        return r`<tr key=${t}><td>${t}</td><td>${String(e.env[t])}</td></tr>`;
    })}</tbody></table>`;
}
export { o as Environment };
