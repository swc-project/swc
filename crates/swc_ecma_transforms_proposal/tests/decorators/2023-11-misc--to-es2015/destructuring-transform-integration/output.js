// from https://github.com/tc39/test262/blob/9e03c403e73341658d8d485a673798ae61f6f94a/test/language/statements/class/decorator/syntax/class-valid/decorator-member-expr-private-identifier.js
class C {
}
(()=>{
    var _class;
    var _initClass, _class1;
    var D = ((_class = class {
    }, { c: [_class1, _initClass] } = _apply_decs_2311(_class, [
        C,
        _class_static_private_method_get(C, C, $),
        C,
        _class_static_private_field_spec_get(C, _class, __)
    ], [], 1), _initClass(), _class), _class1);
})();
function $() {}
function _() {}
;
