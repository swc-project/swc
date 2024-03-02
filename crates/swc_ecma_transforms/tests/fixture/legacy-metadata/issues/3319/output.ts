import 'reflect-metadata';

let returnType: unknown;

function decorator(target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    returnType = Reflect.getMetadata('design:returntype', target, key);
}

enum NumericEnum {
    A,
    B,
    C
}
enum StringEnum {
    A = "A",
    B = "B",
    C = "C"
}

enum ObjectEnum {
    A = "A",
    B = 2,
    C = "C"
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
    public numeric_array(): number[] {
        return [1, 2, 3];
    }
    public string_array(): string[] {
        return ['first', 'second', 'third'];
    }
    public numeric_enum(): NumericEnum {
        return NumericEnum.A;
    }
    public string_enum(): StringEnum {
        return StringEnum.A;
    }
    public object_enum(): ObjectEnum {
        return ObjectEnum.A;
    }
    public array_enum(): StringEnum[] {
        return [StringEnum.A, StringEnum.B, StringEnum.C];
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
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Array)
], Foo.prototype, "numeric_array", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Array)
], Foo.prototype, "string_array", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Number)
], Foo.prototype, "numeric_enum", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], Foo.prototype, "string_enum", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Object)
], Foo.prototype, "object_enum", null);
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Array)
], Foo.prototype, "array_enum", null);
