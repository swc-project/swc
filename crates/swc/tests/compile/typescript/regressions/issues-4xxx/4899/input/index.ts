function es5ClassCompat(target: Function): any {
    ///@ts-expect-error
    function _() {
        return Reflect.construct(target, arguments, this.constructor);
    }
    Object.defineProperty(
        _,
        "name",
        Object.getOwnPropertyDescriptor(target, "name")!
    );
    Object.setPrototypeOf(_, target);
    Object.setPrototypeOf(_.prototype, target.prototype);
    return _;
}

@es5ClassCompat
class Foo {
    static create() {
        return new Foo();
    }

    constructor() {}
}
