import 'reflect-metadata'

let returnType: unknown;

function decorator(target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    returnType = Reflect.getMetadata('design:returntype', target, key);
}

enum NumericEnum {
    A,
    B,
    C,
}

enum StringEnum {
    A = "A",
    B = "B",
    C = "C",
}

enum ObjectEnum {
    A = "A",
    B = 2,
    C = "C",
}

class Foo {
    @decorator
    public foo(x: string): string {
        return 'foo';
    }

    @decorator
    public bar(x: string): number {
        return 123;
    }

    @decorator
    public baz(): string | number {
        return 'baz';
    }

    @decorator
    public qux() {
        return 'qux';
    }

    @decorator
    public async quux() {
        return 'quux';
    }

    @decorator
    public numeric_array(): number[] {
        return [1, 2, 3];
    }

    @decorator
    public string_array(): string[] {
        return ['first', 'second', 'third'];
    }

    @decorator
    public numeric_enum(): NumericEnum {
        return NumericEnum.A;
    }

    @decorator
    public string_enum(): StringEnum {
        return StringEnum.A;
    }

    @decorator
    public object_enum(): ObjectEnum {
        return ObjectEnum.A;
    }

    @decorator
    public array_enum(): StringEnum[] {
        return [StringEnum.A, StringEnum.B, StringEnum.C];
    }
}
