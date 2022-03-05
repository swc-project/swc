import * as swcHelpers from "@swc/helpers";
export class Empty extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("div", null, "Hello"));
    }
}
// OK
let unionedSpread = /*#__PURE__*/ React.createElement(Empty, swcHelpers.extends({}, obj));
