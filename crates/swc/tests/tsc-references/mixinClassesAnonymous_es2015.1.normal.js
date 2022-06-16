class Base {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Derived extends Base {
    constructor(x, y, z){
        super(x, y);
        this.z = z;
    }
}
const Printable = (superClass)=>{
    class _class extends superClass {
        print() {
            const output = this.x + "," + this.y;
        }
    }
    _class.message = "hello";
    return _class;
};
function Tagged(superClass) {
    class C extends superClass {
        constructor(...args){
            super(...args);
            this._tag = "hello";
        }
    }
    return C;
}
const Thing1 = Tagged(Derived);
const Thing2 = Tagged(Printable(Derived));
Thing2.message;
function f1() {
    const thing = new Thing1(1, 2, 3);
    thing.x;
    thing._tag;
}
function f2() {
    const thing = new Thing2(1, 2, 3);
    thing.x;
    thing._tag;
    thing.print();
}
class Thing3 extends Thing2 {
    test() {
        this.print();
    }
    constructor(tag){
        super(10, 20, 30);
        this._tag = tag;
    }
}
// Repro from #13805
const Timestamped = (Base)=>{
    return class extends Base {
        constructor(...args){
            super(...args);
            this.timestamp = new Date();
        }
    };
};
