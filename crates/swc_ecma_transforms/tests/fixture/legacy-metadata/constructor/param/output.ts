class Foo {
    constructor(p: string, readonly p2: string){}
}
Foo = _ts_decorate([
    _ts_param(0, dec1()),
    _ts_param(1, dec2()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ])
], Foo);
