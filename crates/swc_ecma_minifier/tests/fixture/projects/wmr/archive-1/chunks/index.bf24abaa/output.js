import { m } from "../index.f66dda46.js";
const process_env = {
    FOO: "bar",
    OVERRIDE: "11",
    EMPTY: "",
    FOO_LOCAL: "bar",
    NODE_ENV: "production"
};
function Environment() {
    return m`<table><thead><tr><th>Name ${42}</th><th>Value</th></tr></thead><tbody>${Object.keys(process_env).sort().map((key)=>m`<tr key=${key}><td>${key}</td><td>${String(process_env[key])}</td></tr>`)}</tbody></table>`;
}
export { Environment };
