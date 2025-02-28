import { _ as o } from "@swc/helpers/_/_async_to_generator";
import { _ as s } from "@swc/helpers/_/_ts_generator";
import { displayContent as a } from './fouc';
import n from './on-demand-entries-client';
import { addMessageListener as r, connectHMR as c } from './error-overlay/websocket';
var e = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = e;
var t = e.assetPrefix, i = e.page, _ = null, u = __webpack_hash__, d = (t = t || '') + (t.endsWith('/') ? '' : '/') + '_next/static/webpack/';
function p() {
    return (p = o(function() {
        var e, t;
        return s(this, function(a) {
            switch(a.label){
                case 0:
                    if (_ === __webpack_hash__ || 'idle' !== module.hot.status()) return [
                        2
                    ];
                    a.label = 1;
                case 1:
                    return a.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]), [
                        4,
                        fetch('undefined' != typeof __webpack_runtime_id__ ? "".concat(d).concat(u, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(d).concat(u, ".hot-update.json"))
                    ];
                case 2:
                    return [
                        4,
                        a.sent().json()
                    ];
                case 3:
                    return e = a.sent(), t = '/' === i ? 'index' : i, (Array.isArray(e.c) ? e.c : Object.keys(e.c)).some(function(e) {
                        return -1 !== e.indexOf("pages".concat(t.startsWith('/') ? t : "/".concat(t))) || -1 !== e.indexOf("pages".concat(t.startsWith('/') ? t : "/".concat(t)).replace(/\//g, '\\'));
                    }) ? document.location.reload(!0) : u = _, [
                        3,
                        5
                    ];
                case 4:
                    return console.error('Error occurred checking for update', a.sent()), document.location.reload(!0), [
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
r(function(e) {
    if ('\uD83D\uDC93' !== e.data) try {
        var t = JSON.parse(e.data);
        if ('sync' === t.action || 'built' === t.action) {
            if (!t.hash) return;
            _ = t.hash, function() {
                p.apply(this, arguments);
            }();
        } else 'reloadPage' === t.action && document.location.reload(!0);
    } catch (t) {
        console.warn('Invalid HMR message: ' + e.data + '\n' + t);
    }
}), c({
    assetPrefix: t,
    path: '/_next/webpack-hmr'
}), a(), n(e.page);
