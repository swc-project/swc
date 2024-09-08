import { _ as r } from "@swc/helpers/_/_async_to_generator";
export const styleLoader = ()=>{
    return {
        setup (t) {
            t.onLoad(/*#__PURE__*/ function() {
                var t = r(function*(r) {});
                return function(r) {
                    return t.apply(this, arguments);
                };
            }());
        }
    };
};
