import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as c } from "react/jsx-runtime";
import i from "react-markdown";
var o = function(r) {
    return c(i, {
        children: r
    });
}, s = function(_param) {
    var r = _param.text, tmp = _param.renderText, t = tmp === void 0 ? o : tmp, p = _object_without_properties(_param, [
        "text",
        "renderText"
    ]);
    return c("div", {
        children: t(r)
    });
};
export { s as RichText, o as defaultRenderFn };
