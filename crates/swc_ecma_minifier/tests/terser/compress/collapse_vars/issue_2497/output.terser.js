function sample() {
    if (true)
        for (var i = 0; i < 1; ++i)
            for (var k = 0; k < 1; ++k) {
                value = 1;
                value = value ? value + 1 : 0;
            }
    else for (i = 0; i < 1; ++i) for (k = 0; k < 1; ++k) var value = 1;
}
