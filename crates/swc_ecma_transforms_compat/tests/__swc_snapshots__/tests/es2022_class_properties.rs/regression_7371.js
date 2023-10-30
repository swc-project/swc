"use strict";
class C {
}
class A extends C {
    constructor(){
        super();
        _define_property(this, "field", 1);
        class B extends C {
            constructor(){
                super();
                expect(this.field).toBeUndefined();
            }
        }
        expect(this.field).toBe(1);
        new B();
    }
}
new A();
class Obj {
    constructor(){
        return {};
    }
}
// ensure superClass is still transformed
class SuperClass extends Obj {
    constructor(){
        var _temp;
        class B extends (_temp = super(), _define_property(this, "field", 1), _temp, Obj) {
            constructor(){
                super();
                expect(this.field).toBeUndefined();
            }
        }
        expect(this.field).toBe(1);
        new B();
    }
}
new SuperClass();
// ensure ComputedKey Method is still transformed
class ComputedMethod extends Obj {
    constructor(){
        var _temp;
        let _tmp = (_temp = super(), _define_property(this, "field", 1), _temp);
        class B extends Obj {
            [_tmp]() {}
            constructor(){
                super();
                expect(this.field).toBeUndefined();
            }
        }
        expect(this.field).toBe(1);
        new B();
    }
}
new ComputedMethod();
// ensure ComputedKey Field is still transformed
class ComputedField extends Obj {
    constructor(){
        var _temp;
        let _ref = (_temp = super(), _define_property(this, "field", 1), _temp);
        class B extends Obj {
            constructor(){
                super();
                _define_property(this, _ref, 1);
                expect(this.field).toBeUndefined();
            }
        }
        expect(this.field).toBe(1);
        new B();
    }
}
new ComputedField();
