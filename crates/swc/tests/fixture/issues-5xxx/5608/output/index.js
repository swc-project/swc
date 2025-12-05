import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as c } from "react/jsx-runtime";
import i from "react-markdown";
var o = function(r) {
    return c(i, {
        children: r
    });
}, s = function(_0) {
    var r = _0.text, tmp = _0.renderText, t = tmp === void 0 ? o : tmp, p = _object_without_properties(_0, [
        "text",
        "renderText"
    ]);
    return c("div", {
        children: t(r)
    });
};
export { s as RichText, o as defaultRenderFn };
