// Nonconstructible functions throw synchronously even when their bodies are empty.
let f = async ()=>{};
try {
    new f();
} catch (error) {
    console.log(error instanceof TypeError);
}
