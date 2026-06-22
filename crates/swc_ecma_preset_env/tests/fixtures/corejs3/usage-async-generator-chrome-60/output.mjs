import "core-js/modules/es.promise.js";
export default function() {
    return _wrap_async_generator(function*() {
        yield 1;
    })();
}
export async function plain() {
    await 2;
}
