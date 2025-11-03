const o = async function o({ mallId: _o, targetUserId: e, from: n }) {
    const t = {
        mTitle: "hello",
        mallId: _o,
        from: n,
        targetUserId: e
    };
    try {
        const _o = "https://www.example.com";
        await window.JSBridge.openInAppBrowser(_o);
    } catch (_o) {
        await window.JSBridge.openInAppBrowser(t.url);
    }
};
export { o as showPopup };
