import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class Foo {
    bar(x = /*#__PURE__*/ _async_to_generator(function*() {
        return yield 1;
    })) {}
}
