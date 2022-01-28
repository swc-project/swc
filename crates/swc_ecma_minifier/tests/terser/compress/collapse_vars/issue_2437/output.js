!(function () {
    if (xhrDesc) {
        var result = !!(req = new XMLHttpRequest()).onreadystatechange;
        return (
            Object.defineProperty(
                XMLHttpRequest.prototype,
                "onreadystatechange",
                xhrDesc || {}
            ),
            result
        );
    }
    var req,
        detectFunc = function () {};
    ((req = new XMLHttpRequest()).onreadystatechange = detectFunc),
        (result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc),
        (req.onreadystatechange = null);
})();
