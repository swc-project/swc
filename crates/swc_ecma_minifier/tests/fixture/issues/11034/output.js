export function f() {
    const foo = window.e ? "bar" : "baz";
    foo = "it's not allowed";
    console.log(`foo=${foo}`);
}
