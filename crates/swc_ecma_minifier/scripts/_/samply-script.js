
(async () => {
    const treeView = document.querySelector(".treeViewBodyInner.treeViewBodyInner1");
    const rows = treeView.querySelectorAll('.treeViewRow');

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function triggerMouseEvent(node, eventType) {
        var clickEvent = new PointerEvent(eventType, { button: 0, bubbles: true, cancelable: true });
        node.dispatchEvent(clickEvent);
    }

    async function handleRow(row) {
        const lib = row.querySelector('.lib');
        const libText = lib.textContent.trim();
        if (libText.endsWith("/swc_ecma_visit/src/generated.rs")) {
            triggerMouseEvent(row, "mouseover");
            triggerMouseEvent(row, "mousedown");
            triggerMouseEvent(row, "mouseup");
            triggerMouseEvent(row, "click");
            await sleep(300);

            row.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'm' }));
            await sleep(500);
        }
    }

    for (const row of rows) {
        if (await handleRow(row)) {
            break;
        }
    }

})();
