//// [file.tsx]
export default function Component(props) {
    return React.createElement(AnotherComponent, props);
}
function AnotherComponent(param) {
    var property1 = param.property1;
    return React.createElement("span", null, property1);
}
