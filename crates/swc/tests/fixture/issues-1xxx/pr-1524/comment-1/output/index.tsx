import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function Bar() {
    var _useState = _sliced_to_array(useState(0), 2), foo = _useState[0], setFoo = _useState[1];
    // @refresh reset
    React.useEffect(function() {});
    return /*#__PURE__*/ React.createElement("h1", null, foo, " ");
}
