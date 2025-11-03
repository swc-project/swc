// Test case for Safari ID destructuring collision bug
// Issue: https://github.com/swc-project/swc/issues/11083
// WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=220517

const showPopup = async function showPopup({ mallId, targetUserId, from }) {
    const popup = {
        mTitle: "hello",
        mallId,
        from,
        targetUserId
    };
    try {
        const url = "https://www.example.com";
        await window.JSBridge.openInAppBrowser(url);
    } catch (e) {
        await window.JSBridge.openInAppBrowser(popup.url);
    }
};

export { showPopup };
