import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
function a(param) {
    var _b = param.b, b = _b === void 0 ? [] : _b;
    var t = useMemo(function() {
        return(// Cmt1
        _to_consumable_array(a.slice(0, 1)).concat(// Cmt2
        _to_consumable_array(b), // Cmt3
        _to_consumable_array(c.slice(1))));
    }, [
        frameworks
    ]);
    return 1;
}
export default a;
