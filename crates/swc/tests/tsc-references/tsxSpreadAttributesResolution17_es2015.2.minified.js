import * as swcHelpers from "@swc/helpers";
export class Empty extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Empty, swcHelpers.extends({}, obj));
