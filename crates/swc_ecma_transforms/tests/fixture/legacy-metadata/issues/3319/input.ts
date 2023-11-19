import 'reflect-metadata'

let returnType: unknown;

function decorator(target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    returnType = Reflect.getMetadata('design:returntype', target, key);
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
}
