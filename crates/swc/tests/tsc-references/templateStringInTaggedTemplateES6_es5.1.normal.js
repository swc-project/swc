import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
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
// @target: ES6
"I AM THE TAG  PORTION"(_templateObject(), "AM");
