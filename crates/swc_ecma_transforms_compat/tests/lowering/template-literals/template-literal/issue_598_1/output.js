function _templateObject() {
    const data = _tagged_template_literal([
        "Hello World"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = _tagged_template_literal([
        "Nobody will ever see this."
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
export function foo() {
    console.log(i18n(_templateObject()));
    console.log(i18n(_templateObject1()));
}
