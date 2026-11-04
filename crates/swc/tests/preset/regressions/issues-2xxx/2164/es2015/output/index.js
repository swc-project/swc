import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function fn() {
    return _async_to_generator(function*() {
        for(const key in {});
    })();
}
