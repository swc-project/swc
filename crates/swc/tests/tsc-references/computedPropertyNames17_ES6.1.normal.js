//// [computedPropertyNames17_ES6.ts]
var b;
class C {
    get [b]() {
        return 0;
    }
    static set [true](v) {}
    get [[]]() {
        return 0;
    }
    set [{}](v) {}
    static get [undefined]() {
        return 0;
    }
    set [null](v) {}
}
