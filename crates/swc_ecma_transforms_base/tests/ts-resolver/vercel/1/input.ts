var n = t(3957);
function o(e) {
    const r = e.nextUrl;

    if ("/log" !== r.pathname) {
        if ("/throw-error-internal" === r.pathname) {
            function r() {
                return e();
            }
            try {
                r();
            } catch (o) {
                console.error(o);
            }
            return new Promise((e, r) => r(new Error("oh no!")));
        }
    }
}
