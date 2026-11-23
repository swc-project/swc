//// [taggedTemplateUntypedTagCall01.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello world!"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
(void 0)(_templateObject());
