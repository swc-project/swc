//// [classWithStaticFieldInParameterBindingPattern.ts]
(({ [(class {
    static{
        this.x = 1;
    }
}).x]: b = "" })=>{})();
