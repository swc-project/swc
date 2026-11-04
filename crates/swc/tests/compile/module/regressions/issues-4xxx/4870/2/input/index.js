function test() {
    // only remove number separators, but keep Binary literals
    return 0b1_1111_0111 === 503 && 0o767 === 503;
}
test();
