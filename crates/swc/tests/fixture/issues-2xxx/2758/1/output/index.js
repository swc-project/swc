import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
const obj = {
    // A comment
    foo () {
        return _async_to_generator(function*() {
            console.log("Should work");
        })();
    }
};
