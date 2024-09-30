var _class;
let prop;
class A {
    constructor(a = 1){
        this.a = a;
        this[_console_log] = 456;
    }
}
prop = _console_log = console.log(123);
let prop1;
let b = (_class = class {
    constructor(a = 1){
        this.a = a;
        this[_console_log1] = 123;
    }
}, prop1 = _console_log1 = console.log(456), _class);
var _console_log, _console_log1;
