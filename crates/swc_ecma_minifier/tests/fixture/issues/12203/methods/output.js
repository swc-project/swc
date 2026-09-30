const obj = {
    method (a = void 0) {
        return a = 1, arguments[0];
    },
    set value (a = void 0){
        a = 1, console.log(arguments[0]);
    }
};
console.log(obj.method(2), obj.method.length), obj.value = 2, console.log(Object.getOwnPropertyDescriptor(obj, "value").set.length);
class C {
    constructor(a = void 0){
        this.value = a;
    }
    method(a = void 0) {
        return a;
    }
    static method(a = void 0) {
        return a;
    }
}
console.log(new C(2).value, C.length, C.prototype.method.length, C.method.length);
