import { m as o } from "../index.f66dda46.js";
import { u as e, a as t, b as a, c as d, d as r } from "./hoofd.module.6c5395cb.js";
function c() {
    e("nl");
    t("%s | 💭");
    a("Welcome to hoofd");
    d({
        name: "author",
        content: "Jovi De Croock"
    });
    r({
        rel: "me",
        href: "https://jovidecroock.com"
    });
    return o`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`;
}
export { c as MetaTags };
