import { html, css, LitElement } from "lit";

export class App extends LitElement {
    name: string;

    static styles = css`
        p {
            color: blue;
        }
    `;

    static properties = {
        name: { type: String },
    };

    constructor() {
        super();
        this.name = "Somebody";
    }

    render() {
        return html`<p>Hello, ${this.name}!</p>`;
    }
}
customElements.define("app", App);
