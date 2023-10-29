var _apply_decs_2203_r = require("@swc/helpers/_/_apply_decs_2203_r");
var _initClass, _initClass1, _Bar;
const dec = ()=>{};
let _Bar1;
class Bar1 {
    static{
        ({ c: [_Bar1, _initClass] } = _apply_decs_2203_r(this, [], [
            dec1
        ]));
    }
    static{
        _initClass();
    }
}
let _Foo;
class Foo extends (_Bar = Bar) {
    static{
        ({ c: [_Foo, _initClass1] } = _apply_decs_2203_r(this, [], [
            dec2
        ], _Bar));
    }
    static{
        _initClass1();
    }
}
