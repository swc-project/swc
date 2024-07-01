(async () => {
    const log = [];
    const dummy = () => { };
    async function wrapper() {
        @(log.push(await Promise.resolve(0)), dummy)
        class Foo extends (log.push(await Promise.resolve(1)), Object) {
            @(log.push(await Promise.resolve(2)), dummy)
            method() { }
            @(log.push(await Promise.resolve(3)), dummy)
            static method() { }
            @(log.push(await Promise.resolve(4)), dummy)
            field;
            @(log.push(await Promise.resolve(5)), dummy)
            static field;
            @(log.push(await Promise.resolve(6)), dummy)
            get getter() { return; }
            @(log.push(await Promise.resolve(7)), dummy)
            static get getter() { return; }
            @(log.push(await Promise.resolve(8)), dummy)
            set setter(x) { }
            @(log.push(await Promise.resolve(9)), dummy)
            static set setter(x) { }
            @(log.push(await Promise.resolve(10)), dummy)
            accessor accessor;
            @(log.push(await Promise.resolve(11)), dummy)
            static accessor accessor;
        }
    }
    await wrapper();
    assertEq(() => '' + log, '0,1,2,3,4,5,6,7,8,9,10,11');
})();
