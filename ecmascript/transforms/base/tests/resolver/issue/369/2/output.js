function a() {
}
function b() {
}
function foo({ a: b1  }) {
    expect(b1).toBe('a');
}
foo({
    a: 'a'
});
