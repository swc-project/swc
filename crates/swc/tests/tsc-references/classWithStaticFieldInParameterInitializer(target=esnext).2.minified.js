//// [classWithStaticFieldInParameterInitializer.ts]
((b = class {
    static{
        this.x = 1;
    }
})=>{})();
