// Nonconstructible functions throw synchronously even when their bodies are empty.
function main() {
    const f = async () => {};
    try {
        new f();
    } catch (error) {
        console.log(error instanceof TypeError);
    }
}
main();
