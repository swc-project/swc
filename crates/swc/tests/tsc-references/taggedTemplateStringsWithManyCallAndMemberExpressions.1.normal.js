//// [taggedTemplateStringsWithManyCallAndMemberExpressions.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "abc",
        "def"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var f;
var x = new new new (f(_templateObject(), 0)).member("hello")(42) === true;
