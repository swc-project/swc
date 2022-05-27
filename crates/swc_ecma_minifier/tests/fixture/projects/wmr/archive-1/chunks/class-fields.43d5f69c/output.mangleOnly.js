import { _ as a, m as c } from "../index.f66dda46.js";
class b extends a {
    state = {
        value: 1
    };
    onClick = ()=>{
        this.setState((a)=>({
                value: a.value + 1
            }));
    };
    render() {
        return c`<div><p> State: <span>${this.state.value}</span></p><button onClick=${this.onClick}>click me</button></div>`;
    }
}
export default b;
