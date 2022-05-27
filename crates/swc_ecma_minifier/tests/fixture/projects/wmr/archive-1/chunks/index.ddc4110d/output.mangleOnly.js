import { s as b, y as c, m as d } from "../index.f66dda46.js";
null;
const e = {
    about: "about_migxty"
};
function a({ query: a , title: b  }) {
    c(()=>{
        console.log("Mounted About: ", b);
        return ()=>{
            console.log("Unmounting About: ", b);
        };
    }, []);
    return d`<section class=${e.about}><h1>${b || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(a)}</pre></section>`;
}
export default a;
