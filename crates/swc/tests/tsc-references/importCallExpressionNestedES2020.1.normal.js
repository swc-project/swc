//// [foo.ts]
export default "./foo";
//// [index.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function foo() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        return yield import((yield import("./foo")).default);
    })();
}
