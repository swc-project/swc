//// [taggedTemplateStringsWithTagNamedDeclare.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello ",
        " world!"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
!function(x) {
    for(var _len = arguments.length, ys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)ys[_key - 1] = arguments[_key];
}(_templateObject(), 0);
