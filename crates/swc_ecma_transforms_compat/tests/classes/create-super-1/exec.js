const UnknownNativeClass = Array;

class Foo extends UnknownNativeClass {}

new Foo();
console.log("PASS");
