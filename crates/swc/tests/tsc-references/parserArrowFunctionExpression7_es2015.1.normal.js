// @target: esnext
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
({
    m () {
        return _async_to_generator(function*() {
            for(;;){}
        })();
    }
});
