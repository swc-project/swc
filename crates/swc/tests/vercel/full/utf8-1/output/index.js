import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_ts_generator";
import { displayContent as a } from "./fouc";
import n from "./on-demand-entries-client";
import { addMessageListener as r, connectHMR as c } from "./error-overlay/websocket";
var o = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = o;
var s = o.assetPrefix, i = o.page;
s = s || "";
var _ = null, u = __webpack_hash__, d = s + (s.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function p() {
    return (p = e(function() {
        var e, a;
        return t(this, function(t) {
            switch(t.label){
                case 0:
                    if (!(_ !== __webpack_hash__) || "idle" !== module.hot.status()) return [
                        2
                    ];
                    t.label = 1;
                case 1:
                    return t.trys.push([
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
                        t.sent().json()
                    ];
                case 3:
                    return e = t.sent(), a = "/" === i ? "index" : i, (Array.isArray(e.c) ? e.c : Object.keys(e.c)).some(function(e) {
                        return -1 !== e.indexOf("pages".concat(a.startsWith("/") ? a : "/".concat(a))) || -1 !== e.indexOf("pages".concat(a.startsWith("/") ? a : "/".concat(a)).replace(/\//g, "\\"));
                    }) ? document.location.reload(!0) : u = _, [
                        3,
                        5
                    ];
                case 4:
                    return console.error("Error occurred checking for update", t.sent()), document.location.reload(!0), [
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
r(function(o) {
    if ("\uD83D\uDC93" !== o.data) try {
        var s = JSON.parse(o.data);
        if ("sync" === s.action || "built" === s.action) {
            if (!s.hash) return;
            _ = s.hash, function() {
                p.apply(this, arguments);
            }();
        } else "reloadPage" === s.action && document.location.reload(!0);
    } catch (e) {
        console.warn("Invalid HMR message: " + o.data + "\n" + e);
    }
}), c({
    assetPrefix: s,
    path: "/_next/webpack-hmr"
}), a(), n(o.page);
