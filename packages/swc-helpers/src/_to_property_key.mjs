import _to_primitive from "./_to_primitive.mjs";
import _type_of from "./_type_of.mjs";
export default function _to_property_key(arg) {
    var key = _to_primitive(arg, "string");
    return _type_of(key) === "symbol" ? key : String(key);
}
