// @target: es2019
type Types = 'boolean' | 'unknown' | 'string';

type Properties<T extends { [key: string]: Types }> = {
    readonly [key in keyof T]: T[key] extends 'boolean' ? boolean : T[key] extends 'string' ? string : unknown
}

type AnyCtor<P extends object> = new (...a: any[]) => P

declare function classWithProperties<T extends { [key: string]: Types }, P extends object>(properties: T, klass: AnyCtor<P>): {
    new(): P & Properties<T>;
    prototype: P & Properties<T>
};

const Base = classWithProperties({
    get x() { return 'boolean' as const },
    y: 'string',
}, class Base {
});

class MyClass extends Base {
    get x() {
        return false;
    }
    get y() {
        return 'hi'
    }
}

const mine = new MyClass();
const value = mine.x;

