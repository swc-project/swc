import { m as e } from "../index.f66dda46.js";
import { u as a, a as t, b as r, c as n, d as o } from "./hoofd.module.6c5395cb.js";
function d() {
    a("nl");
    t("%s | 💭");
    r("Welcome to hoofd");
    n({
        name: "author",
        content: "Jovi De Croock"
    });
    o({
        rel: "me",
        href: "https://jovidecroock.com"
    });
    return e`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`;
}
export { d as MetaTags };
