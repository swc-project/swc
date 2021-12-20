var _class;
function foo(x = class {
}) {
    return undefined;
}
// Should not infer string because it is a static property
foo((_class = class {
}, _class.prop = "hello", _class)).length;
