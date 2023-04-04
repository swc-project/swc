//// [templateStringInTaggedTemplate.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "I ",
        " THE TEMPLATE PORTION"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
"I AM THE TAG  PORTION"(_templateObject(), "AM");
