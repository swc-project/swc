import _extends from "@swc/helpers/src/_extends.mjs";
export class Empty extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    }
}
// OK
let unionedSpread = /*#__PURE__*/ React.createElement(Empty, _extends({}, obj));
