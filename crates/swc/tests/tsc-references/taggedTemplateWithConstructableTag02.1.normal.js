//// [taggedTemplateWithConstructableTag02.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello world!"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var tag;
tag(_templateObject());
