import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.promise.js";
export async function* values() {
    yield 1;
}
export function plain() {
    return _async_to_generator(function*() {
        yield 2;
    })();
}
