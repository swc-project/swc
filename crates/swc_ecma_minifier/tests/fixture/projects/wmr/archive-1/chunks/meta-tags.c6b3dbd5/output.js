import { m } from "../index.f66dda46.js";
import { u as useLang } from "./hoofd.module.6c5395cb.js";
import { a as useTitleTemplate } from "./hoofd.module.6c5395cb.js";
import { b as useTitle } from "./hoofd.module.6c5395cb.js";
import { c as useMeta } from "./hoofd.module.6c5395cb.js";
import { d as useLink } from "./hoofd.module.6c5395cb.js";
function MetaTags() {
    return useLang("nl"), useTitleTemplate("%s | 💭"), useTitle("Welcome to hoofd"), useMeta({
        name: "author",
        content: "Jovi De Croock"
    }), useLink({
        rel: "me",
        href: "https://jovidecroock.com"
    }), m`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`;
}
import "../index.f66dda46.js";
import "./hoofd.module.6c5395cb.js";
export { MetaTags as MetaTags };
