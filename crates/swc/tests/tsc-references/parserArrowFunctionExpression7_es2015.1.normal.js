import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: esnext
({
    m () {
        return _async_to_generator(function*() {
            for(;;){}
        })();
    }
});
