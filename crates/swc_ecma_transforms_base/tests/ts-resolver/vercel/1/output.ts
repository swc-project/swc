var n__2 = t(3957);
function o__2(e__3) {
    const r__3 = e__3.nextUrl;
    if ("/log" !== r__3.pathname) {
        if ("/throw-error-internal" === r__3.pathname) {
            function r__5() {
                return e__3();
            }
            try {
                r__5();
            } catch (o__8) {
                console.error(o__8);
            }
            return new Promise((e__9, r__9)=>r__9(new Error("oh no!")));
        }
    }
}
