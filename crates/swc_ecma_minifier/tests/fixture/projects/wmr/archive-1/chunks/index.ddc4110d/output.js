import { y, m } from "../index.f66dda46.js";
export default function({ query, title }) {
    return y(()=>(console.log("Mounted About: ", title), ()=>{
            console.log("Unmounting About: ", title);
        }), []), m`<section class=${"about_migxty"}><h1>${title || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(query)}</pre></section>`;
}
