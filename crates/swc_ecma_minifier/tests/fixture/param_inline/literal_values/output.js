// Various literal types that can be inlined
function literals() {
    let str = "hello";
    console.log(str, 42, true, null);
    return str + 42;
}
literals();
literals();
literals();
