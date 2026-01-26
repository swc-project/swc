import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
class Foo {
    bar(x = ()=>_async_to_generator(function*() {
            return yield 1;
        })()) {}
}
