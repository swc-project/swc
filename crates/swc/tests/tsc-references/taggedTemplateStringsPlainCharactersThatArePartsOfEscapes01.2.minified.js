//// [taggedTemplateStringsPlainCharactersThatArePartsOfEscapes01.ts]
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 2028 2029 0085 t v f b r n"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
!function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}(_templateObject());
