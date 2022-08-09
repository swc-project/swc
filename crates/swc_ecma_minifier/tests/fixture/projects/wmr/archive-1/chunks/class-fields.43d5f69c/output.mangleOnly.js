import { _ as t, m as e } from "../index.f66dda46.js";
class a extends t {
    state = {
        value: 1
    };
    onClick = ()=>{
        this.setState((t)=>({
                value: t.value + 1
            }));
    };
    render() {
        return e`<div><p> State: <span>${this.state.value}</span></p><button onClick=${this.onClick}>click me</button></div>`;
    }
}
export default a;
