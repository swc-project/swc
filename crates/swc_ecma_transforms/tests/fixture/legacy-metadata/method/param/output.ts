class Foo {
    foo(p: string, p2: string) {}
    static bar(p: string, p2: string) {}
}
_ts_decorate([
    _ts_param(0, dec1()),
    _ts_param(1, dec2()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], Foo.prototype, "foo", null);
_ts_decorate([
    _ts_param(0, dec1()),
    _ts_param(1, dec2()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], Foo, "bar", null);
