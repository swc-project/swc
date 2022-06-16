import { _ as a, m as b } from "../index.f66dda46.js";
class c extends a {
    state = {
        value: 1
    };
    onClick = ()=>{
        this.setState((a)=>({
                value: a.value + 1
            }));
    };
    render() {
        return b`<div><p> State: <span>${this.state.value}</span></p><button onClick=${this.onClick}>click me</button></div>`;
    }
}
export default c;
