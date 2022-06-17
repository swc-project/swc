import assert = require("assert");

assert(true);

namespace Foo {
    export const Baz = 42;
}
import Bar = Foo;
console.log(Bar.Baz);
