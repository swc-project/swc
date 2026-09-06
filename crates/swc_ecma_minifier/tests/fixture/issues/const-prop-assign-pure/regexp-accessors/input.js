function testReadonlyWrites() {
    "use strict";
    const writes = [
        () => { /abc/.dotAll = 1; },
        () => { /abc/.flags = 1; },
        () => { /abc/.global = 1; },
        () => { /abc/.hasIndices = 1; },
        () => { /abc/.ignoreCase = 1; },
        () => { /abc/.multiline = 1; },
        () => { /abc/.source = 1; },
        () => { /abc/.sticky = 1; },
        () => { /abc/.unicode = 1; },
        () => { /abc/.unicodeSets = 1; }
    ];
    for (const write of writes) {
        try {
            write();
        } catch (error) {
            console.log(error.name);
        }
    }
    (function () {}.prototype.__proto__ = null);
    /abc/.__proto__ = null;
}
testReadonlyWrites();
