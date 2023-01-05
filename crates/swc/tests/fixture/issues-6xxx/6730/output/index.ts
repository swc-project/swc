import r from "@swc/helpers/src/_async_to_generator.mjs";
export const styleLoader = ()=>{
    return {
        setup (t) {
            t.onLoad(function() {
                var t = r(function*(r) {});
                return function(r) {
                    return t.apply(this, arguments);
                };
            }());
        }
    };
};
