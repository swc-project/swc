import { m } from "../index.f66dda46.js";
import { u as useLang, a as useTitleTemplate, b as useTitle, c as useMeta, d as useLink } from "./hoofd.module.6c5395cb.js";
function MetaTags() {
    return(// Will set <html lang="en">
    useLang("nl"), // Will set title to "Welcome to hoofd | 💭"
    useTitleTemplate("%s | 💭"), useTitle("Welcome to hoofd"), // Credits to an amazing person
    useMeta({
        name: "author",
        content: "Jovi De Croock"
    }), useLink({
        rel: "me",
        href: "https://jovidecroock.com"
    }), m`<div><h1>Meta tag rendering</h1><p>...check document.head in devtools</p></div>`);
}
export { MetaTags };
