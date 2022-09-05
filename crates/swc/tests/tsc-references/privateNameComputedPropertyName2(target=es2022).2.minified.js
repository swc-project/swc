//// [privateNameComputedPropertyName2.ts]
console.log((new class {
    #x = 100;
    _() {}
}).#x);
