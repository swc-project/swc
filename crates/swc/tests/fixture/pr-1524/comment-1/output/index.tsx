import * as swcHelpers from "@swc/helpers";
function Bar() {
    var ref = swcHelpers.slicedToArray(useState(0), 2), foo = ref[0], setFoo = ref[1];
    // @refresh reset
    React.useEffect(function() {});
    return(/*#__PURE__*/ React.createElement("h1", null, foo, " "));
}
