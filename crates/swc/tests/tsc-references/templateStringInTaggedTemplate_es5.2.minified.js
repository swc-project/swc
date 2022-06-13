import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "I ",
        " THE TEMPLATE PORTION"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
"I AM THE TAG  PORTION"(_templateObject(), "AM");
