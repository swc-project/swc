//// [computedPropertyNames29_ES6.ts]
class C {
    bar() {
        ()=>{
            var obj = {
                [this.bar()] () {}
            };
        };
        return 0;
    }
}
