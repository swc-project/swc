import e from "@swc/helpers/src/_async_to_generator.mjs";
import t from "@swc/helpers/src/_ts_generator.mjs";
import { displayContent as a } from "./fouc";
import r from "./on-demand-entries-client";
import { addMessageListener as n, connectHMR as c } from "./error-overlay/websocket";
var o = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = o;
var s = o.assetPrefix, i = o.page, _ = null, u = __webpack_hash__, d = (s = s || "") + (s.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function p() {
    return (p = e(function() {
        var e, a, r, n, c;
        return t(this, function(e) {
            switch(e.label){
                case 0:
                    if (!(_ !== __webpack_hash__) || "idle" !== module.hot.status()) return [
                        2
                    ];
                    e.label = 1;
                case 1:
                    return e.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]), [
                        4,
                        fetch("undefined" != typeof __webpack_runtime_id__ ? "".concat(d).concat(u, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(d).concat(u, ".hot-update.json"))
                    ];
                case 2:
                    return [
                        4,
                        e.sent().json()
                    ];
                case 3:
                    return a = e.sent(), r = "/" === i ? "index" : i, (Array.isArray(a.c) ? a.c : Object.keys(a.c)).some(function(e) {
                        return -1 !== e.indexOf("pages".concat(r.startsWith("/") ? r : "/".concat(r))) || -1 !== e.indexOf("pages".concat(r.startsWith("/") ? r : "/".concat(r)).replace(/\//g, "\\"));
                    }) ? document.location.reload(!0) : u = $, [
                    })) ? document.location.reload(!0) : u = _, [
                        3,
                        5
                    ];
                case 4:
                    return c = e.sent(), console.error("Error occurred checking for update", c), document.location.reload(!0), [
                        3,
                        5
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
n(function(e) {
    if ("\uD83D\uDC93" !== e.data) try {
        var t = JSON.parse(e.data);
        if ("sync" === t.action || "built" === t.action) {
            if (!t.hash) return;
            _ = t.hash, function() {
                p.apply(this, arguments);
            }();
        } else "reloadPage" === t.action && document.location.reload(!0);
    } catch (a) {
        console.warn("Invalid HMR message: " + e.data + "\n" + a);
    }
}), c({
    assetPrefix: s,
    path: "/_next/webpack-hmr"
}), a(), r(o.page);
