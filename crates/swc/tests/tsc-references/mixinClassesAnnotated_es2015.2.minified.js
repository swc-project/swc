class Base {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}
class Derived extends Base {
    constructor(x, y, z){
        super(x, y), this.z = z;
    }
}
function Tagged(superClass) {
    return class extends superClass {
        constructor(...args){
            super(...args), this._tag = "hello";
        }
    };
}
Tagged(Derived);
const Thing2 = Tagged(((superClass)=>{
    class _class extends superClass {
        print() {
            this.x + this.y;
        }
    }
    return _class.message = "hello", _class;
})(Derived));
Thing2.message;
