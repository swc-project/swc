// @noImplicitAny: true
// @noImplicitThis: true
class MyClass {
    fn() {
        //type of 'this' in an object literal is the containing scope's this
        var t = {
            x: this,
            y: this.t
        };
        var t;
    }
}
//type of 'this' in an object literal method is the type of the object literal
var obj = {
    f () {
        return this.spaaace;
    }
};
var obj;
