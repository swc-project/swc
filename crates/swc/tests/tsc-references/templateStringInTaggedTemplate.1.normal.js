//// [templateStringInTaggedTemplate.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "I ",
        " THE TEMPLATE PORTION"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
"I AM THE TAG  PORTION"(_templateObject(), "AM");
