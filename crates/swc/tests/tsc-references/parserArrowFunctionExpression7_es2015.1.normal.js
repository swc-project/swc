import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @target: esnext
({
    m () {
        return _async_to_generator(function*() {
            for(;;){}
        })();
    }
});
