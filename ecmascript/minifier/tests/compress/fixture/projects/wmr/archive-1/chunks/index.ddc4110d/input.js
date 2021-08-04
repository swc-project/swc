import { s as style, y, m } from "../index.f66dda46.js";
null;
const styles = {
    about: "about_migxty",
};
function About({ query, title }) {
    y(() => {
        console.log("Mounted About: ", title);
        return () => {
            console.log("Unmounting About: ", title);
        };
    }, []);
    return m`<section class=${styles.about}><h1>${
        title || "About"
    }</h1><p>My name is Jason.</p><pre>${JSON.stringify(
        query
    )}</pre></section>`;
}
export default About;
