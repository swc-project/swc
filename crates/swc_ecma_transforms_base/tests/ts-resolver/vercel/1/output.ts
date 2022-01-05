var n = t(3957);
function o(e__2) {
    const r__2 = e__2.nextUrl;
    if ('/log' !== r__2.pathname) {
        if ('/throw-error-internal' === r__2.pathname) {
            function r__3() {
                return e__2();
            }
            try {
                r__3();
            } catch (o__4) {
                console.error(o__4);
            }
            return new Promise((e__5, r__5)=>r__5(new Error('oh no!'))
            );
        }
    }
}
