import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_ts_generator";
import { displayContent as a } from './fouc';
import r from './on-demand-entries-client';
import { addMessageListener as n, connectHMR as c } from './error-overlay/websocket';
var o = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = o;
var s = o.assetPrefix, _ = o.page, i = null, u = __webpack_hash__, d = (s = s || '') + (s.endsWith('/') ? '' : '/') + '_next/static/webpack/';
n(function(a) {
    if ('\uD83D\uDC93' !== a.data) try {
        var r = JSON.parse(a.data);
        if ('sync' === r.action || 'built' === r.action) {
            if (!r.hash) return;
            i = r.hash, e(function() {
                var e, a;
                return t(this, function(t) {
                    switch(t.label){
                        case 0:
                            if (i === __webpack_hash__ || 'idle' !== module.hot.status()) return [
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
                                fetch("u" > typeof __webpack_runtime_id__ ? "".concat(d).concat(u, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(d).concat(u, ".hot-update.json"))
                            ];
                        case 2:
                            return [
                                4,
                                t.sent().json()
                            ];
                        case 3:
                            return e = t.sent(), a = '/' === _ ? 'index' : _, (Array.isArray(e.c) ? e.c : Object.keys(e.c)).some(function(e) {
                                return -1 !== e.indexOf("pages".concat(a.startsWith('/') ? a : "/".concat(a))) || -1 !== e.indexOf("pages".concat(a.startsWith('/') ? a : "/".concat(a)).replace(/\//g, '\\'));
                            }) ? document.location.reload(!0) : u = i, [
                                3,
                                5
                            ];
                        case 4:
                            return console.error('Error occurred checking for update', t.sent()), document.location.reload(!0), [
                                3,
                                5
                            ];
                        case 5:
                            return [
                                2
                            ];
                    }
                });
            })();
        } else 'reloadPage' === r.action && document.location.reload(!0);
    } catch (e) {
        console.warn('Invalid HMR message: ' + a.data + '\n' + e);
    }
}), c({
    assetPrefix: s,
    path: '/_next/webpack-hmr'
}), a(), r(o.page);
