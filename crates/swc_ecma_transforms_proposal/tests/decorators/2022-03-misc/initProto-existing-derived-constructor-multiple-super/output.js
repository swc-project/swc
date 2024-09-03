var _initProto, _initProto1;
const dec = ()=>{};
class A extends B {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                deco,
                2,
                "method"
            ]
        ], []));
    }
    constructor(){
        if (Math.random() > 0.5) {
            super(true), _initProto(this);
        } else {
            super(false), _initProto(this);
        }
    }
    method() {}
}
class C extends B {
    static{
        ({ e: [_initProto1] } = _apply_decs_2203_r(this, [
            [
                deco,
                2,
                "method"
            ]
        ], []));
    }
    constructor(){
        try {
            super([
                super(),
                _initProto1(this)
            ][0], null.x), _initProto1(this);
        } catch  {}
    }
    method() {}
}
