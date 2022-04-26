var n__1 = t(3957);
function o__1(e__3) {
    const r__3 = e__3.nextUrl;
    if ('/log' !== r__3.pathname) {
        if ('/throw-error-internal' === r__3.pathname) {
            function r__4() {
                return e__3();
            }
            try {
                r__4();
            } catch (o__5) {
                console.error(o__5);
            }
            return new Promise((e__6, r__6)=>r__6(new Error('oh no!'))
            );
        }
    }
}
