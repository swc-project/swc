// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var num;
var var1;
class C1 {
    // Inside function declaration
    p1(param) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param === "string" && param.length; // string
    }
    // Inside function declaration
    p2(param1) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param1 === "string" && param1.length; // string
    }
    // Inside function declaration
    static s1(param2) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param2 === "string" && param2.length; // string
    }
    // Inside function declaration
    static s2(param3) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param3 === "string" && param3.length; // string
    }
    constructor(param4){
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param4 === "string" && param4.length; // string
    }
}
