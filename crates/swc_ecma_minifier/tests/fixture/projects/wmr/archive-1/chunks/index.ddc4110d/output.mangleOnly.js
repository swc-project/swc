import { s as t, y as o, m as n } from "../index.f66dda46.js";
null;
const u = {
    about: "about_migxty"
};
function e({ query: t , title: e  }) {
    o(()=>{
        console.log("Mounted About: ", e);
        return ()=>{
            console.log("Unmounting About: ", e);
        };
    }, []);
    return n`<section class=${u.about}><h1>${e || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(t)}</pre></section>`;
}
export default e;
