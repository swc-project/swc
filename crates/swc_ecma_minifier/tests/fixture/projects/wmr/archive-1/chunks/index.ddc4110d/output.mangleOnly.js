import { s as a, y as b, m as c } from "../index.f66dda46.js";
null;
const d = {
    about: "about_migxty"
};
function e({ query: a , title: e  }) {
    b(()=>{
        console.log("Mounted About: ", e);
        return ()=>{
            console.log("Unmounting About: ", e);
        };
    }, []);
    return c`<section class=${d.about}><h1>${e || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(a)}</pre></section>`;
}
export default e;
