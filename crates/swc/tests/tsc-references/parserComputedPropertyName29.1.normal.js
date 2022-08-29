//// [parserComputedPropertyName29.ts]
let _e = e;
class C {
    constructor(){
        // yes ASI
        this[_e] = id++;
    }
}
