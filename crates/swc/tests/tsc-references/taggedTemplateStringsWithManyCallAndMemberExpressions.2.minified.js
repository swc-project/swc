//// [taggedTemplateStringsWithManyCallAndMemberExpressions.ts]
var f;
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "abc",
        "def"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
new new new (f(_templateObject(), 0)).member("hello")(42);
