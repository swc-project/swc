// @filename: component.tsx
/** @jsx predom */ import { predom } from "./renderer2";
import prerendered from "./component";
export const MySFC = (props)=>/*#__PURE__*/ predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
export class MyClass {
    render() {
        return /*#__PURE__*/ predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }
    constructor(props){
        this.props = props;
    }
}
export const tree = /*#__PURE__*/ predom(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(MyClass, {
    x: 5,
    y: 6
}));
export default /*#__PURE__*/ predom("h", null);
let elem = prerendered;
elem = /*#__PURE__*/ predom("h", null); // Expect assignability error here
const DOMSFC = (props)=>/*#__PURE__*/ predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y, props.children);
class DOMClass {
    render() {
        return /*#__PURE__*/ predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }
    constructor(props){
        this.props = props;
    }
}
// Should work, everything is a DOM element
const _tree = /*#__PURE__*/ predom(DOMSFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(DOMClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(DOMClass, {
    x: 5,
    y: 6
}));
// Should fail, no dom elements
const _brokenTree = /*#__PURE__*/ predom(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(MyClass, {
    x: 5,
    y: 6
}));
// Should fail, nondom isn't allowed as children of dom
const _brokenTree2 = /*#__PURE__*/ predom(DOMSFC, {
    x: 1,
    y: 2
}, tree, tree);
