import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
const obj = {
    // A comment
    foo () {
        return _async_to_generator(function*() {
            console.log("Should work");
        })();
    }
};
