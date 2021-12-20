class MyClass {
    constructor(){
        this.p = 123;
        this.pp = 123;
        this.ppp = 123;
    }
}
MyClass.sp = 123;
MyClass.spp = 123;
MyClass.sppp = 123;
class MyGenericClass {
}
MyClass.prototype.extension1 = function(p) {
    this.p = p;
    this.pp = p;
    this.ppp = p;
    MyClass.sp = p;
    MyClass.spp = p;
    MyClass.sppp = p;
};
MyClass.prototype.extension2 = function(p) {
    this.p = p;
    this.pp = p;
    this.ppp = p;
    MyClass.sp = p;
    MyClass.spp = p;
    MyClass.sppp = p;
};
function extension3(p) {
    this.p = p;
    this.pp = p;
    this.ppp = p;
    MyClass.sp = p;
    MyClass.spp = p;
    MyClass.sppp = p;
}
MyClass.prototype.extension3 = extension3;
function extension4(p) {
    this.p = p;
    this.pp = p;
    this.ppp = p;
    MyGenericClass.sp = p;
    MyGenericClass.spp = p;
    MyGenericClass.sppp = p;
}
