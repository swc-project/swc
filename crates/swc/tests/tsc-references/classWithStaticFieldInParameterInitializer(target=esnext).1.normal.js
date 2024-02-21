//// [classWithStaticFieldInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
((b = class {
    static{
        this.x = 1;
    }
})=>{})();
