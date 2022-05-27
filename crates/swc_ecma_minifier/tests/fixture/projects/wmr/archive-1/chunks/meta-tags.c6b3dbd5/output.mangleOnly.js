import { m as b } from "../index.f66dda46.js";
import { u as c, a as d, b as e, c as f, d as g } from "./hoofd.module.6c5395cb.js";
function a() {
    c("nl");
    d("%s | 💭");
    e("Welcome to hoofd");
    f({
        name: "author",
        content: "Jovi De Croock"
    });
    g({
        rel: "me",
        href: "https://jovidecroock.com"
    });
    return b`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`;
}
export { a as MetaTags };
