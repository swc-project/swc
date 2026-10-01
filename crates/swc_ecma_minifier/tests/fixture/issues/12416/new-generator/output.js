// Nonconstructible functions throw synchronously even when their bodies are empty.
let f = function*() {};
try {
    new f();
} catch (error) {
    console.log(error instanceof TypeError);
}
