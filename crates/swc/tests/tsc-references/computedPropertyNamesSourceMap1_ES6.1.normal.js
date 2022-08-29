//// [computedPropertyNamesSourceMap1_ES6.ts]
class C {
    ["hello"]() {
        debugger;
    }
    get ["goodbye"]() {
        return 0;
    }
}
