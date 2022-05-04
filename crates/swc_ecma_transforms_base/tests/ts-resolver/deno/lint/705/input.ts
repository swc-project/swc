import type { Foo } from "./foo.ts";
//            ^^^ <---- (a)
function _bar(...Foo: Foo) {
    //                    ^^^ <---- (b)
    console.log(Foo);
}
