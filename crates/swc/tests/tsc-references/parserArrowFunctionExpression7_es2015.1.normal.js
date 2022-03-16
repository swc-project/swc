import * as swcHelpers from "@swc/helpers";
// @target: esnext
({
    m () {
        return swcHelpers.asyncToGenerator(function*() {
            for(;;){}
        })();
    }
});
