function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
    prop: "";
}
__decorate([
    MyDecorator(MyClass),
    __metadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
