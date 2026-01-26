enum Options {
    foo = 0
}
function decorate() {
    return function() {};
}
class Foo {
    foo(options: Options) {}
}
_ts_decorate([
    decorate(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], Foo.prototype, "foo", null);
