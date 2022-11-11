import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function a(param) {
    var _param_b = param.b, b = _param_b === void 0 ? [] : _param_b;
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
