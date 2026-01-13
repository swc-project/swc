//// [file.tsx]
export default function Component(props) {
    return(// Error: missing property
    /*#__PURE__*/ React.createElement(AnotherComponent, props));
}
function AnotherComponent(param) {
    var property1 = param.property1;
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
