import "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
import { m } from "../index.f66dda46.js";
const default_export = function({ query, title }) {
    return y(()=>(console.log("Mounted About: ", title), ()=>{
            console.log("Unmounting About: ", title);
        }), []), m`<section class=${"about_migxty"}><h1>${title || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(query)}</pre></section>`;
};
export { default_export as default };
