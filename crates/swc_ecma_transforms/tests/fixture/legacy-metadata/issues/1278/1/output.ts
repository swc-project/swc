function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
    prop: "";
}
_ts_decorate([
    MyDecorator(MyClass),
    _ts_metadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
