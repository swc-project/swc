function _templateObject() {
    const data = _tagged_template_literal([
        "some template"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = _tagged_template_literal([
        "some template"
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
var tag = (v)=>v;
function foo() {
    return tag(_templateObject());
}
function bar() {
    return tag(_templateObject1());
}
expect(foo()).toBe(foo());
expect(foo()).toEqual([
    "some template"
]);
expect(bar()).toBe(bar());
expect(bar()).toEqual([
    "some template"
]);
expect(bar()).not.toBe(foo());
