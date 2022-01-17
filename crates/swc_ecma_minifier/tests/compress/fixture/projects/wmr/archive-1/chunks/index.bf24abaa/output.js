import { s as style, m } from "../index.f66dda46.js";
const process = {
    browser: !0,
    env: {
        FOO: "bar",
        OVERRIDE: "11",
        EMPTY: "",
        FOO_LOCAL: "bar",
        NODE_ENV: "production"
    }
}, foo = 42;
function Environment() {
    return m`<table><thead><tr><th>Name ${42}</th><th>Value</th></tr></thead><tbody>${Object.keys(process.env).sort().map((key)=>{
        return m`<tr key=${key}><td>${key}</td><td>${String(process.env[key])}</td></tr>`;
    })}</tbody></table>`;
}
export { Environment };
