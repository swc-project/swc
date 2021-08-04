import { _, m } from "../index.f66dda46.js";
class ClassFields extends _ {
    state = {
        value: 1,
    };

    onClick = () => {
        this.setState((prev) => ({
            value: prev.value + 1,
        }));
    };

    render() {
        return m`<div><p> State: <span>${this.state.value}</span></p><button onClick=${this.onClick}>click me</button></div>`;
    }
}
export default ClassFields;
