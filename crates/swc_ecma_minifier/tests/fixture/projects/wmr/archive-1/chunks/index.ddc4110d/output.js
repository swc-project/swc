import { s as style, y, m } from "../index.f66dda46.js";
const styles = {
    about: "about_migxty"
};
function About({ query , title  }) {
    return y(()=>(console.log("Mounted About: ", title), ()=>{
            console.log("Unmounting About: ", title);
        })
    , []), m`<section class=${styles.about}><h1>${title || "About"}</h1><p>My name is Jason.</p><pre>${JSON.stringify(query)}</pre></section>`;
}
export default About;
