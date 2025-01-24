
(async () => {
    const treeView = document.querySelector(".treeViewBodyInner.treeViewBodyInner1");

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function triggerMouseEvent(node, eventType) {
        var clickEvent = new PointerEvent(eventType, { button: 0, bubbles: true, cancelable: true });
        node.dispatchEvent(clickEvent);
    }

    async function sendKey(node, key, keyCode, code) {
        node.dispatchEvent(new KeyboardEvent("keydown", {
            key: key,
            keyCode: keyCode,
            code: code,
            which: keyCode,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true,
        }));
        node.dispatchEvent(new KeyboardEvent("keyup", {
            key: key,
            keyCode: keyCode,
            code: code,
            which: keyCode,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true,
        }));

    }

    async function handleRow(row) {
        const lib = row.querySelector('.lib');
        const libText = lib.textContent.trim();
        if (libText.endsWith("/swc_ecma_visit/src/generated.rs") ||
            libText.endsWith("/swc_ecma_utils/src/parallel.rs") ||
            libText.includes('/.rustup/') ||
            libText.includes('chili-0.2.0/') ||
            libText.includes('scoped-tls-1.0.1/') ||
            libText.includes('indexmap-2.7.1/') ||
            libText.includes('hashbrown-0.14.5/') ||
            libText.includes('/rust/deps/') ||
            libText.includes('/better_scoped_tls/') ||
            libText.includes('/swc_parallel/')) {
            triggerMouseEvent(row, "mouseover");
            triggerMouseEvent(row, "mousedown");
            triggerMouseEvent(row, "mouseup");
            triggerMouseEvent(row, "click");
            await sleep(30);

            await sendKey(row, 'm', 77, 'KeyM');
            await sleep(100);
            return true;
        }
    }


    while (true) {
        const rows = treeView.querySelectorAll('.treeViewRow');
        console.log(`Checking ${rows.length} rows`);


        let didWork = false;
        for (const row of rows) {
            if (await handleRow(row)) {
                console.log("Worked");
                didWork = true;
                break;
            }
        }

        if (!didWork) {
            break;
        }
    }

})();
