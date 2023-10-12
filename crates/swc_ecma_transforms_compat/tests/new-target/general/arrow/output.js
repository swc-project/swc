function Foo() {
    var _newtarget = this instanceof Foo ? this.constructor : void 0;
    const a = function() {
        _newtarget;
    };
}
class Bar {
    constructor(){
        var _newtarget = this.constructor;
        const a = function() {
            _newtarget;
        };
    }
}
