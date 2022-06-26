import { m as a } from "../index.f66dda46.js";
import { u as b, a as c, b as d, c as e, d as f } from "./hoofd.module.6c5395cb.js";
function g() {
    b("nl");
    c("%s | 💭");
    d("Welcome to hoofd");
    e({
        name: "author",
        content: "Jovi De Croock"
    });
    f({
        rel: "me",
        href: "https://jovidecroock.com"
    });
    return a`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`;
}
export { g as MetaTags };
