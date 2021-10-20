import * as swcHelpers from "@swc/helpers";
function a(param) {
    var _b = param.b, b = _b === void 0 ? [] : _b;
    var t = useMemo(function() {
        return(// Cmt1
        swcHelpers.toConsumableArray(a.slice(0, 1)).concat(// Cmt2
        swcHelpers.toConsumableArray(b), // Cmt3
        swcHelpers.toConsumableArray(c.slice(1))));
    }, [
        frameworks
    ]);
    return 1;
}
export default a;
