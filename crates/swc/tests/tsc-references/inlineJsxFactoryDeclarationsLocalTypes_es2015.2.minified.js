import { predom } from "./renderer2";
import prerendered from "./component";
export const MySFC = (props)=>predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
export class MyClass {
    render() {
        return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }
    constructor(props){
        this.props = props;
    }
}
export const tree = predom(MySFC, {
    x: 1,
    y: 2
}, predom(MyClass, {
    x: 3,
    y: 4
}), predom(MyClass, {
    x: 5,
    y: 6
}));
export default predom("h", null);
