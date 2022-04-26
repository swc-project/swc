import { html, css, LitElement } from 'lit';
export class App extends LitElement {
    render() {
        return html`<p>Hello, ${this.name}!</p>`;
    }
    constructor(){
        super();
        this.name = 'Somebody';
    }
}
App.styles = css`p { color: blue }`;
App.properties = {
    name: {
        type: String
    }
};
customElements.define('app', App);
