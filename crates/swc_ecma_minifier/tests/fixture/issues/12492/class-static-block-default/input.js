function run() {
    class A {
        static {
            const x = console.log("static");
        }
    }
    console.log("after");
}
run();
