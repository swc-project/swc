function test() {
    // only remove number separators, but keep Binary literals
    return 0b111110111 === 503 && 0o767 === 503;
}
test();
