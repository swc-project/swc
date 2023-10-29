var _apply_decs_2203_r = require("@swc/helpers/_/_apply_decs_2203_r");
var _identity = require("@swc/helpers/_/_identity");
var _initClass;
const dec = ()=>{};
let _Foo;
new class extends _identity {
    constructor(){
        super(Foo), _initClass();
    }
    static{
        class Foo1 {
            static{
                ({ c: [_Foo, _initClass] } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
            static foo = new _Foo();
        }
    }
}();
const foo = new Foo();
