import 'reflect-metadata';

let returnType: unknown;

function decorator(target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    returnType = Reflect.getMetadata('design:returntype', target, key);
}

class Foo {
    public foo(x: string): string {
        return 'foo';
    }
    public bar(x: string): number {
        return 123;
    }
    public baz(): string | number {
        return 'baz';
    }
    public qux() {
        return 'qux';
    }
    public async quux() {
        return 'quux';
    }
}
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [String]),
    _ts_metadata("design:returntype", String)
], Foo.prototype, "foo", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [String]),
    _ts_metadata("design:returntype", Number)
], Foo.prototype, "bar", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Object)
], Foo.prototype, "baz", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], Foo.prototype, "qux", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], Foo.prototype, "quux", null);
