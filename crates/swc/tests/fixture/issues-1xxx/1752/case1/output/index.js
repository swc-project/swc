import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function generate() {
    return _wrap_async_generator(function*() {
        const results = yield _await_async_generator(Promise.all([
            Promise.resolve(1),
            Promise.resolve(2),
            Promise.resolve(3)
        ]));
        for (const result of results){
            console.log(`yield ${result}`);
            yield result;
        }
    })();
}
async function printValues() {
    const iterator = generate();
    for await (const value of iterator){
        console.log(`iterator value: ${value}`);
    }
}
printValues();
