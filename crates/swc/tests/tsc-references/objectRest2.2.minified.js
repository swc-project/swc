//// [objectRest2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
_async_to_generator(function*(context, args) {
    let { objects } = yield {
        objects: 12
    };
    return _object_spread({}, connectionFromArray(objects, args));
});
