var _class;
function foo(x = class {
}) {
    return undefined;
}
foo((_class = class {
}, _class.prop = "hello", _class)).length;
