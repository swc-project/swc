//// [taggedTemplateStringsWithManyCallAndMemberExpressions.ts]
var f;
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
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
