//// [taggedTemplateUntypedTagCall01.ts]
var tag;
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello world!"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
tag(_templateObject());
