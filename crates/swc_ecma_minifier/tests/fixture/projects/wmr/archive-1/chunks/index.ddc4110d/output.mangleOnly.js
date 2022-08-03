import { s as o, y as t, m as n } from "../index.f66dda46.js";
null;
const r = {
    about: "about_migxty"
};
function s({ query: o , title: s  }) {
    t(()=>{
        console.log("Mounted About: ", s);
        return ()=>{
            console.log("Unmounting About: ", s);
        };
    }, []);
    return n`<section class=${r.about}><h1>${s || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(o)}</pre></section>`;
}
export default s;
