import { displayContent } from './fouc';
import initOnDemandEntries from './on-demand-entries-client';
import { addMessageListener, connectHMR } from './error-overlay/websocket';
const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = data;
let { assetPrefix, page } = data;
assetPrefix = assetPrefix || '';
let mostRecentHash = null;
let curHash = __webpack_hash__;
const hotUpdatePath = assetPrefix + (assetPrefix.endsWith('/') ? '' : '/') + '_next/static/webpack/';
function isUpdateAvailable() {
    return mostRecentHash !== __webpack_hash__;
}
function canApplyUpdates() {
    return module.hot.status() === 'idle';
}
async function tryApplyUpdates() {
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        return;
    }
    try {
        const res = await fetch(typeof __webpack_runtime_id__ !== 'undefined' ? `${hotUpdatePath}${curHash}.${__webpack_runtime_id__}.hot-update.json` : `${hotUpdatePath}${curHash}.hot-update.json`);
        const jsonData = await res.json();
        const curPage = page === '/' ? 'index' : page;
        const pageUpdated = (Array.isArray(jsonData.c) ? jsonData.c : Object.keys(jsonData.c)).some((mod)=>{
            return (mod.indexOf(`pages${curPage.startsWith('/') ? curPage : `/${curPage}`}`) !== -1 || mod.indexOf(`pages${curPage.startsWith('/') ? curPage : `/${curPage}`}`.replace(/\//g, '\\')) !== -1);
        });
        if (pageUpdated) {
            document.location.reload(true);
        } else {
            curHash = mostRecentHash;
        }
    } catch (err) {
        console.error('Error occurred checking for update', err);
        document.location.reload(true);
    }
}
addMessageListener((event)=>{
    if (event.data === '\uD83D\uDC93') {
        return;
    }
    try {
        const message = JSON.parse(event.data);
        if (message.action === 'sync' || message.action === 'built') {
            if (!message.hash) {
                return;
            }
            mostRecentHash = message.hash;
            tryApplyUpdates();
        } else if (message.action === 'reloadPage') {
            document.location.reload(true);
        }
    } catch (ex) {
        console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
    }
});
connectHMR({
    assetPrefix,
    path: '/_next/webpack-hmr'
});
displayContent();
initOnDemandEntries(data.page);
