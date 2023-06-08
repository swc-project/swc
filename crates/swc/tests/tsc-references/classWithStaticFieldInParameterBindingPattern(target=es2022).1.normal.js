//// [classWithStaticFieldInParameterBindingPattern.ts]
// https://github.com/microsoft/TypeScript/issues/36295
(({ [(class {
    static{
        this.x = 1;
    }
}).x]: b = "" })=>{})();
