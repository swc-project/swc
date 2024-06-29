import "../index.f66dda46.js";
import { _ } from "../index.f66dda46.js";
import { m } from "../index.f66dda46.js";
const default_export = class extends _ {
    state = {
        value: 1
    };
    onClick = ()=>{
        this.setState((prev)=>({
                value: prev.value + 1
            }));
    };
    render() {
        return m`<div><p> State: <span>${this.state.value}</span></p><button onClick=${this.onClick}>click me</button></div>`;
    }
};
export { default_export as default };
