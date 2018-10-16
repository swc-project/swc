a = class {
    static b() {}
    static get c() {}
    static set d(a) {}
    static() { /* "static" can be a method name! */ }
    get() { /* "get" can be a method name! */ }
    set() { /* "set" can be a method name! */ }
}