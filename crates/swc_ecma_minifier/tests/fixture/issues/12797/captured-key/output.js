let write, read;
// A callback stored by a computed key mutates the class.
class C {
    [(write = ()=>(C.value = 42, C.value), "method")]() {}
    static cache = console.log("init C");
}
// A callback stored by a computed key only reads the class.
class D {
    [(read = ()=>D.name, "other")]() {}
    static cache = console.log("init D");
}
console.log(write(), read());
