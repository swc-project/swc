var _init_decoratedField, _init_secondField, _initProto;
function method(_, context) {
    context.addInitializer(function() {
        this.initializedBeforeFields = !Object.prototype.hasOwnProperty.call(this, "decoratedField");
    });
}
function field() {
    return function(value) {
        return value;
    };
}
class A {
    static{
        ({ e: [_init_decoratedField, _init_secondField, _initProto] } = _apply_decs_2203_r(this, [
            [
                method,
                2,
                "m"
            ],
            [
                field,
                0,
                "decoratedField"
            ],
            [
                field,
                0,
                "secondField"
            ]
        ], []));
    }
    m() {}
    decoratedField = (_initProto(this), _init_decoratedField(this, 1));
    secondField = _init_secondField(this, 2);
}
