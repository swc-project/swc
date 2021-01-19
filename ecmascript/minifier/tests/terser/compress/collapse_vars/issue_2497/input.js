function sample() {
    if (true) {
        for (var i = 0; i < 1; ++i) {
            for (var k = 0; k < 1; ++k) {
                var value = 1;
                var x = value;
                value = x ? x + 1 : 0;
            }
        }
    } else {
        for (var i = 0; i < 1; ++i) {
            for (var k = 0; k < 1; ++k) {
                var value = 1;
            }
        }
    }
}
