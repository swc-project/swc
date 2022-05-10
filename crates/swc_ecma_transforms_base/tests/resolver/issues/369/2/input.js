function a() {}
function b() {}
function foo({ a: b }) {
    expect(b).toBe("a");
}
foo({ a: "a" });
