let _console_log = console.log(123);
class A {
    constructor(a = 1){
        this.a = a;
        this[_console_log] = 456;
    }
}
let _console_log1;
let b = (_console_log1 = console.log(456), class {
    constructor(a = 1){
        this.a = a;
        this[_console_log1] = 123;
    }
});
