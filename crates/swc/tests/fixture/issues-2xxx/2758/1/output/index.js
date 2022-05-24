import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
const obj = {
    // A comment
    foo () {
        return _async_to_generator(function*() {
            console.log("Should work");
        })();
    }
};
