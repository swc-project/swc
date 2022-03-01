// @target: es5
var b;
let _b = b, _undefined = undefined;
class C {
    get [_b]() {
        return 0;
    }
    static set [true](v) {}
    get [[]]() {
        return 0;
    }
    set [{}](v) {}
    static get [_undefined]() {
        return 0;
    }
    set [null](v) {}
}
