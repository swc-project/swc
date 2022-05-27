import { s as b, m as c } from "../index.f66dda46.js";
const d = {
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
const e = 42;
function a() {
    return c`<table><thead><tr><th>Name ${e}</th><th>Value</th></tr></thead><tbody>${Object.keys(d.env).sort().map((a)=>{
        return c`<tr key=${a}><td>${a}</td><td>${String(d.env[a])}</td></tr>`;
    })}</tbody></table>`;
}
export { a as Environment };
