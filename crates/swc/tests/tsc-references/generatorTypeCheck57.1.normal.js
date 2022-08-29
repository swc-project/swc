//// [generatorTypeCheck57.ts]
function* g() {
    class C {
        constructor(){
            this.x = yield 0;
        }
    }
}
