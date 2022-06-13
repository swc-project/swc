import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function Bar() {
    var ref = _sliced_to_array(useState(0), 2), foo = ref[0], setFoo = ref[1];
    // @refresh reset
    React.useEffect(function() {});
    return /*#__PURE__*/ React.createElement("h1", null, foo, " ");
}
