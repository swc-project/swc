
const UnknownNativeClass = Array;


class Foo extends UnknownNativeClass {
}

console.log(new Foo())