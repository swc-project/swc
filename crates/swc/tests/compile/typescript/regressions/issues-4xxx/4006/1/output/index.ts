import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { html, css, LitElement } from "lit";
export class App extends LitElement {
    render() {
        return html`<p>Hello, ${this.name}!</p>`;
    }
    constructor(){
        super(), _define_property(this, "name", void 0);
        this.name = "Somebody";
    }
}
_define_property(App, "styles", css`
        p {
            color: blue;
        }
    `);
_define_property(App, "properties", {
    name: {
        type: String
    }
});
customElements.define("app", App);
