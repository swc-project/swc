function r() {
    if (true) {
        for (var r = 0; r < 1; ++r) {
            for (var a = 0; a < 1; ++a) {
                var v = 1;
                var f = v;
                v = f ? f + 1 : 0;
            }
        }
    } else {
        for (var r = 0; r < 1; ++r) {
            for (var a = 0; a < 1; ++a) {
                var v = 1;
            }
        }
    }
}
