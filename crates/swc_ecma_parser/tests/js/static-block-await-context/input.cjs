class C {
    static {
        function parameter(await) {}
        function defaultValue(value = await) {}
        function computed({ [await]: value }) {}
        function* generator(await) {}
        (function await() {});
        class D {
            constructor(await) {}
            method(await) {}
            set value(await) {}
            field = await;
        }
    }
}
