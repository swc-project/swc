//// [objectRest2.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
_async_to_generator(function*(context, args) {
    let { objects  } = yield {
        objects: 12
    };
    return _extends({}, connectionFromArray(objects, args));
});
