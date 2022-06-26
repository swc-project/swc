import { s as a, m as b } from "../index.f66dda46.js";
const c = {
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
const d = 42;
function e() {
    return b`<table><thead><tr><th>Name ${d}</th><th>Value</th></tr></thead><tbody>${Object.keys(c.env).sort().map((a)=>{
        return b`<tr key=${a}><td>${a}</td><td>${String(c.env[a])}</td></tr>`;
    })}</tbody></table>`;
}
export { e as Environment };
