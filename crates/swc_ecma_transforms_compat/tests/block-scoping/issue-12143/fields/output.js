for(var i__3 = 0, C__3 = class {
    x = i__3;
}, _i__14 = i__3; _i__14 < 1; _i__14++){
    console.log(new C__3().x);
}
for(var i__5 = 0, C__5 = class {
    #x = i__5;
}, _i__15 = i__5; _i__15 < 1; _i__15++){
    console.log(new C__5());
}
for(var i__7 = 0, C__7 = class {
    accessor x = i__7;
}, _i__16 = i__7; _i__16 < 1; _i__16++){
    console.log(new C__7().x);
}
for(var i__9 = 0, C__9 = class {
    accessor #x = i__9;
}, _i__17 = i__9; _i__17 < 1; _i__17++){
    console.log(new C__9());
}
// Computed keys and static initializers run during class evaluation.
for(var i__11 = 0, C__11 = class {
    [i__11] = 1;
    static x = i__11;
    static #x = i__11;
    static accessor y = i__11;
    static accessor #y = i__11;
    static{
        this.z = i__11;
    }
}; i__11 < 1; i__11++){
    console.log(new C__11());
}
